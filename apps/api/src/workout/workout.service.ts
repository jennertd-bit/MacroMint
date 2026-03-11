import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenerateWorkoutDto } from "./workout.dto";

@Injectable()
export class WorkoutService {
  constructor(private readonly config: ConfigService) {}

  private buildPrompt(dto: GenerateWorkoutDto): string {
    const goalDescriptions: Record<string, string> = {
      maintain: "maintain current weight and improve overall fitness",
      diet: "lose weight gradually while preserving muscle (light cut, ~−300 kcal/day)",
      lose: "lose weight steadily (moderate cut, ~−500 kcal/day)",
      shred: "aggressive fat loss while retaining lean mass (−750 kcal/day)",
      gain: "build lean muscle with a steady lean bulk (+300 kcal/day)",
      bulk: "maximise muscle gain with a caloric surplus (+500 kcal/day)",
      custom: "reach their custom nutrition goal",
    };

    const activityLabels: Record<string, string> = {
      "1.2": "sedentary (desk job, minimal movement)",
      "1.375": "lightly active (1–3 days exercise/week)",
      "1.55": "moderately active (3–5 days exercise/week)",
      "1.725": "very active (6–7 days exercise/week)",
      "1.9": "extremely active (athlete or twice-daily training)",
    };

    const goalDesc = goalDescriptions[dto.goalPreset || "maintain"];
    const activityDesc = activityLabels[String(dto.activityLevel)] || "moderately active";
    const tdee = dto.adaptiveTdeeValue || dto.tdeeValue;
    const weightLb = dto.weightKg ? Math.round(dto.weightKg * 2.20462) : null;
    const heightFt = dto.heightCm ? `${Math.floor(dto.heightCm / 30.48)}ft ${Math.round((dto.heightCm % 30.48) / 2.54)}in` : null;

    return `You are an expert certified personal trainer and sports nutritionist. Create a personalised weekly workout plan for a client with the following profile:

- Sex: ${dto.sex || "not specified"}
- Age: ${dto.age ? `${dto.age} years` : "not specified"}
- Weight: ${dto.weightKg ? `${dto.weightKg} kg / ${weightLb} lb` : "not specified"}
- Height: ${dto.heightCm ? `${dto.heightCm} cm / ${heightFt}` : "not specified"}
- Daily energy expenditure (TDEE): ${tdee ? `${tdee} kcal/day` : "not yet calculated"}
- Activity level: ${activityDesc}
- Primary goal: ${goalDesc}

Provide the following, formatted clearly with headings and bullet points:
1. Recommended training split and rationale (e.g. Push/Pull/Legs, Upper/Lower, Full Body)
2. Full 7-day weekly schedule with specific exercises, sets, reps, tempo, and rest periods
3. Cardio recommendations (type, duration, frequency) aligned with their TDEE and goal
4. Two personalised nutrition tips tied to their calorie target and goal
5. One recovery and sleep tip

Be specific, practical, and motivating. Tailor intensity and volume to the goal.`;
  }

  async generate(dto: GenerateWorkoutDto): Promise<{ plan: string }> {
    const apiKey = this.config.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      throw new ServiceUnavailableException("OpenAI API key not configured. Add OPENAI_API_KEY to your environment.");
    }

    const prompt = this.buildPrompt(dto);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new ServiceUnavailableException(`OpenAI error: ${error}`);
    }

    const data = await response.json() as any;
    const plan = data.choices?.[0]?.message?.content || "No plan returned.";
    return { plan };
  }
}
