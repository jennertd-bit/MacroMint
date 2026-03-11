import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsdaService {
  constructor(private readonly config: ConfigService) {}

  private get apiKey() {
    // Fall back to DEMO_KEY so USDA search works without a configured key.
    // DEMO_KEY is rate-limited (30 req/hour) — set USDA_API_KEY for production.
    return this.config.get<string>("USDA_API_KEY") || "DEMO_KEY";
  }

  private ensureKey() {
    return this.apiKey;
  }

  async searchFoods(query: string) {
    const key = this.ensureKey();
    const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
    url.searchParams.set("api_key", key);
    url.searchParams.set("query", query);
    url.searchParams.set("pageSize", "10");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("USDA lookup failed");
    }
    const data = await response.json();
    return data?.foods ?? [];
  }

  async getFood(fdcId: string) {
    const key = this.ensureKey();
    const url = new URL(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}`);
    url.searchParams.set("api_key", key);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("USDA lookup failed");
    }
    return response.json();
  }
}
