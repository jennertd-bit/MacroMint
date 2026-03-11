import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MealSlot, PlannerEventSource, PlannerEventType, ServingUnit } from "@prisma/client";
import { DateTime } from "luxon";
import { BillingService } from "../billing/billing.service";
import { PrismaService } from "../database/prisma.service";
import { UsdaService } from "../usda/usda.service";

const SLOT_PERCENTAGES: Record<MealSlot, number> = {
  BREAKFAST: 0.25,
  LUNCH: 0.3,
  DINNER: 0.3,
  SNACK: 0.15,
  CUSTOM: 0.0
};

@Injectable()
export class PlansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billing: BillingService,
    private readonly usda: UsdaService,
    private readonly config: ConfigService
  ) {}

  private async getTarget(userId: string, date: Date) {
    return this.prisma.goal.findFirst({
      where: {
        userId,
        effectiveFrom: { lte: date },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: date } }]
      },
      orderBy: { effectiveFrom: "desc" }
    });
  }

  private async getDailyTotals(userId: string, date: Date) {
    return this.prisma.dailyTotal.findUnique({
      where: { userId_date: { userId, date } }
    });
  }

  private buildSuggestions(foods: any[], remaining: any) {
    const slots = [MealSlot.BREAKFAST, MealSlot.LUNCH, MealSlot.DINNER, MealSlot.SNACK];
    const suggestions: any[] = [];

    for (const slot of slots) {
      const slotCalories = remaining.calories * (SLOT_PERCENTAGES[slot] || 0.25);
      const options = foods.slice(0, 8).map((food) => {
        const perServing = food.nutrition?.caloriesPerServing ?? 0;
        const qty = perServing > 0 ? Math.max(0.5, Math.min(3, slotCalories / perServing)) : 1;
        return {
          slot,
          items: [
            {
              foodId: food.id,
              name: food.name,
              servingQty: Math.round(qty * 2) / 2,
              servingUnit: ServingUnit.SERVING,
              calories: perServing * qty,
              proteinG: food.nutrition?.proteinG * qty,
              carbsG: food.nutrition?.carbsG * qty,
              fatG: food.nutrition?.fatG * qty
            }
          ]
        };
      });
      suggestions.push({ slot, options });
    }

    return suggestions;
  }

  private buildSuggestionsFromCandidates(candidates: any[], remaining: any) {
    const foods = candidates.map((candidate) => ({
      id: candidate.key,
      name: candidate.name,
      nutrition: {
        caloriesPerServing: candidate.caloriesPerServing,
        proteinG: candidate.proteinG,
        carbsG: candidate.carbsG,
        fatG: candidate.fatG
      }
    }));
    return this.buildSuggestions(foods, remaining);
  }

  private extractNutrient(nutrients: any[], names: string[]) {
    const match = nutrients.find((nutrient) => {
      const name = String(nutrient.nutrientName || nutrient.name || "").toLowerCase();
      return names.some((candidate) => name === candidate.toLowerCase());
    });
    if (!match) return null;
    const value = typeof match.value === "number" ? match.value : Number(match.value);
    return Number.isFinite(value) ? value : null;
  }

  private mapCandidateFoods(foods: any[]) {
    return foods
      .map((food) => ({
        key: food.id,
        name: food.name,
        caloriesPerServing: food.nutrition?.caloriesPerServing ?? 0,
        proteinG: food.nutrition?.proteinG ?? 0,
        carbsG: food.nutrition?.carbsG ?? 0,
        fatG: food.nutrition?.fatG ?? 0,
        source: "USER"
      }))
      .filter((food) => food.caloriesPerServing > 0);
  }

  private async loadUsdaCandidates() {
    const staples = [
      "chicken breast",
      "white rice",
      "oats",
      "banana",
      "egg",
      "salmon",
      "broccoli",
      "greek yogurt",
      "olive oil",
      "peanut butter"
    ];

    const results: any[] = [];
    for (const query of staples) {
      try {
        const foods = await this.usda.searchFoods(query);
        foods.slice(0, 2).forEach((food: any) => results.push(food));
      } catch (error) {
        // Ignore USDA errors.
      }
    }

    return results
      .map((food) => {
        const nutrients = food.foodNutrients || [];
        const calories = this.extractNutrient(nutrients, ["Energy"]);
        const protein = this.extractNutrient(nutrients, ["Protein"]);
        const carbs = this.extractNutrient(nutrients, ["Carbohydrate, by difference"]);
        const fat = this.extractNutrient(nutrients, ["Total lipid (fat)"]);
        if (calories === null || protein === null || carbs === null || fat === null) return null;
        return {
          key: `usda:${food.fdcId}`,
          name: food.description,
          caloriesPerServing: calories,
          proteinG: protein,
          carbsG: carbs,
          fatG: fat,
          source: "USDA"
        };
      })
      .filter(Boolean) as any[];
  }

  private buildAiPrompt(candidates: any[], remaining: any) {
    return {
      system: [
        "You are MacroMint's AI meal planner.",
        "Use only foods from the candidate list.",
        "Return JSON only with the shape:",
        "{ suggestions: [{ slot: 'BREAKFAST', options: [{ items: [{ foodKey, servingQty }] }] }] }.",
        "Use servingQty increments of 0.5.",
        "Aim to fit remaining macros across breakfast, lunch, dinner, snack."
      ].join(" "),
      user: JSON.stringify({ remaining, candidates })
    };
  }

  private async callOpenAi(prompt: { system: string; user: string }) {
    const apiKey = this.config.get<string>("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY missing");
    const model = this.config.get<string>("OPENAI_MODEL") || "gpt-4o-mini";
    const base = (this.config.get<string>("OPENAI_BASE_URL") || "https://api.openai.com").replace(/\/$/, "");

    const response = await fetch(`${base}/v1/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        instructions: prompt.system,
        input: prompt.user,
        text: { format: { type: "json_object" } }
      })
    });

    if (!response.ok) {
      throw new Error("AI planner request failed");
    }

    const data = await response.json();
    const outputText =
      data?.output_text ||
      (data?.output || [])
        .flatMap((item: any) => item?.content || [])
        .filter((content: any) => ["output_text", "text"].includes(content?.type))
        .map((content: any) => content?.text || "")
        .join("");

    const content = outputText || "";
    const match = content.match(/```json([\s\S]*?)```/i);
    const jsonText = match ? match[1] : content;
    return JSON.parse(jsonText);
  }

  private clampMacro(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Number(value));
  }

  private normalizeAiSuggestions(raw: any, candidates: any[]) {
    const slots = [MealSlot.BREAKFAST, MealSlot.LUNCH, MealSlot.DINNER, MealSlot.SNACK];
    const candidateMap = new Map(candidates.map((candidate) => [String(candidate.key), candidate]));
    const rawSuggestions = Array.isArray(raw?.suggestions) ? raw.suggestions : [];

    return slots.map((slot) => {
      const slotEntry = rawSuggestions.find((entry: any) => String(entry?.slot || "").toUpperCase() === slot);
      const options = Array.isArray(slotEntry?.options) ? slotEntry.options : [];

      const normalizedOptions = options
        .map((option: any) => {
          const items = Array.isArray(option?.items) ? option.items : [];
          const mappedItems = items
            .map((item: any) => {
              const foodKey = String(item?.foodKey || item?.key || "");
              const candidate = candidateMap.get(foodKey);
              if (!candidate) return null;
              const rawQty = Number(item?.servingQty ?? 1);
              const servingQty = Math.min(6, Math.max(0.5, Math.round(rawQty * 2) / 2));
              return {
                foodId: candidate.source === "USER" ? candidate.key : undefined,
                name: candidate.name,
                servingQty,
                servingUnit: ServingUnit.SERVING,
                calories: candidate.caloriesPerServing * servingQty,
                proteinG: candidate.proteinG * servingQty,
                carbsG: candidate.carbsG * servingQty,
                fatG: candidate.fatG * servingQty
              };
            })
            .filter(Boolean);

          if (mappedItems.length === 0) return null;
          return { slot, items: mappedItems };
        })
        .filter(Boolean);

      return { slot, options: normalizedOptions };
    });
  }

  async generate(userId: string, dateString?: string) {
    const date = dateString ? DateTime.fromISO(dateString).startOf("day").toJSDate() : new Date();
    const goal = await this.getTarget(userId, date);
    if (!goal) throw new BadRequestException("No goal configured for this date");

    const totals = await this.getDailyTotals(userId, date);
    const remaining = {
      calories: goal.targetCalories - (totals?.calories ?? 0),
      proteinG: goal.targetProteinG - (totals?.proteinG ?? 0),
      carbsG: goal.targetCarbsG - (totals?.carbsG ?? 0),
      fatG: goal.targetFatG - (totals?.fatG ?? 0)
    };

    const foods = await this.prisma.food.findMany({
      where: { createdByUserId: userId },
      include: { nutrition: true },
      take: 20,
      orderBy: { createdAt: "desc" }
    });

    const suggestions = this.buildSuggestions(foods, remaining);

    const record = await this.prisma.plannerSuggestion.create({
      data: {
        userId,
        date,
        payload: { date, remaining, suggestions, source: "rules" }
      }
    });

    return { suggestionId: record.id, remaining, suggestions };
  }

  async generateAi(userId: string, dateString?: string) {
    const date = dateString ? DateTime.fromISO(dateString).startOf("day").toJSDate() : new Date();
    const goal = await this.getTarget(userId, date);
    if (!goal) throw new BadRequestException("No goal configured for this date");

    const allowAiFree = String(this.config.get<string>("ALLOW_AI_FREE") || "").toLowerCase() === "true";
    if (!allowAiFree) {
      await this.billing.requirePro(userId);
    }

    const totals = await this.getDailyTotals(userId, date);
    const remaining = {
      calories: this.clampMacro(goal.targetCalories - (totals?.calories ?? 0)),
      proteinG: this.clampMacro(goal.targetProteinG - (totals?.proteinG ?? 0)),
      carbsG: this.clampMacro(goal.targetCarbsG - (totals?.carbsG ?? 0)),
      fatG: this.clampMacro(goal.targetFatG - (totals?.fatG ?? 0))
    };

    const foods = await this.prisma.food.findMany({
      where: { createdByUserId: userId },
      include: { nutrition: true },
      take: 30,
      orderBy: { createdAt: "desc" }
    });

    const userCandidates = this.mapCandidateFoods(foods);
    let usdaCandidates: any[] = [];
    try {
      usdaCandidates = await this.loadUsdaCandidates();
    } catch (error) {
      usdaCandidates = [];
    }

    const candidates = [...userCandidates, ...usdaCandidates].slice(0, 40);
    if (candidates.length === 0) {
      throw new BadRequestException("No foods available. Add foods or check USDA_API_KEY.");
    }

    const fallbackSuggestions = this.buildSuggestionsFromCandidates(candidates, remaining);
    let suggestions: any[] = [];
    let source = "ai";

    try {
      const prompt = this.buildAiPrompt(candidates, remaining);
      const aiOutput = await this.callOpenAi(prompt);
      suggestions = this.normalizeAiSuggestions(aiOutput, candidates);
      if (!suggestions.some((slot) => slot.options?.length)) {
        throw new Error("Empty AI suggestions");
      }
    } catch (error) {
      source = "rules";
      suggestions = fallbackSuggestions;
    }

    const record = await this.prisma.plannerSuggestion.create({
      data: {
        userId,
        date,
        payload: { date, remaining, suggestions, source }
      }
    });

    return { suggestionId: record.id, remaining, suggestions, source };
  }

  async accept(userId: string, suggestionId: string) {
    const suggestion = await this.prisma.plannerSuggestion.findFirst({
      where: { id: suggestionId, userId }
    });
    if (!suggestion) throw new NotFoundException("Suggestion not found");

    const payload = suggestion.payload as any;
    const created: any[] = [];

    for (const slot of payload.suggestions || []) {
      const option = slot.options?.[0];
      if (!option) continue;
      const total = option.items.reduce(
        (acc: any, item: any) => ({
          calories: acc.calories + item.calories,
          proteinG: acc.proteinG + item.proteinG,
          carbsG: acc.carbsG + item.carbsG,
          fatG: acc.fatG + item.fatG
        }),
        { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
      );

      const event = await this.prisma.plannerEvent.create({
        data: {
          userId,
          date: new Date(payload.date),
          eventType: slot.slot === MealSlot.SNACK ? PlannerEventType.SNACK : PlannerEventType.MEAL,
          title: `${slot.slot.toLowerCase()} plan`,
          description: option.items.map((item: any) => item.name).join(", "),
          plannedCalories: total.calories,
          plannedProteinG: total.proteinG,
          plannedCarbsG: total.carbsG,
          plannedFatG: total.fatG,
          source: PlannerEventSource.AUTO
        }
      });
      created.push(event);
    }

    return { events: created };
  }

  async reject(userId: string, suggestionId: string, reason?: string) {
    await this.prisma.plannerFeedback.create({
      data: {
        userId,
        suggestionId,
        action: "reject",
        reason
      }
    });

    return { status: "ok" };
  }

  async swap(userId: string, suggestionId: string) {
    const suggestion = await this.prisma.plannerSuggestion.findFirst({
      where: { id: suggestionId, userId }
    });
    if (!suggestion) throw new NotFoundException("Suggestion not found");

    return { status: "ok", message: "Swap endpoint coming soon" };
  }

  async listEvents(userId: string, from: string, to: string) {
    const start = DateTime.fromISO(from).startOf("day").toJSDate();
    const end = DateTime.fromISO(to).endOf("day").toJSDate();

    return this.prisma.plannerEvent.findMany({
      where: { userId, date: { gte: start, lte: end } },
      orderBy: { date: "asc" }
    });
  }
}
