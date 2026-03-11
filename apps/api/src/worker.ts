import "reflect-metadata";
import { Worker } from "bullmq";
import { PrismaClient, FoodSource, ScanStatus } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Tesseract = require("tesseract.js");

const prisma = new PrismaClient();
const config = new ConfigService();
const redisUrl = config.get<string>("REDIS_URL");
const isProd = config.get<string>("NODE_ENV") === "production";
const allowLocalRedis = config.get<string>("ALLOW_LOCAL_REDIS") === "true";

const parseNumber = (value?: string | null) => {
  if (!value) return null;
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : null;
};

const matchMacro = (label: string, text: string) => {
  const regex = new RegExp(`${label}[^\\d]*(\\d+(?:\\.\\d+)?)`, "i");
  const match = text.match(regex);
  return match ? parseNumber(match[1]) : null;
};

const matchServing = (text: string) => {
  const regex = /Serving Size\s*([^\n]+)(?:\((\d+(?:\.\d+)?)\s?g\))?/i;
  const match = text.match(regex);
  return {
    label: match?.[1]?.trim() || "1 serving",
    grams: match?.[2] ? parseNumber(match[2]) : null
  };
};

const parseNutrition = (text: string) => {
  const calories = matchMacro("Calories", text) ?? 0;
  const protein = matchMacro("Protein", text) ?? 0;
  const carbs = matchMacro("Total Carbohydrate|Carbohydrate|Carbs", text) ?? 0;
  const fat = matchMacro("Total Fat|Fat", text) ?? 0;
  const fiber = matchMacro("Fiber", text);
  const sugar = matchMacro("Sugars|Sugar", text);
  const sodium = matchMacro("Sodium", text);
  const serving = matchServing(text);

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    sodium,
    serving
  };
};

const fetchImageBuffer = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

if (!redisUrl) {
  console.warn("REDIS_URL not set; scan worker is disabled.");
  process.exit(0);
}

const redis = new URL(redisUrl);
const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(redis.hostname);
if (isProd && isLocalHost && !allowLocalRedis) {
  console.error("REDIS_URL points to localhost in production. Worker is disabled.");
  process.exit(0);
}

const connection = {
  host: redis.hostname,
  port: Number(redis.port || 6379),
  password: redis.password || undefined,
  db: redis.pathname ? Number(redis.pathname.replace("/", "")) || undefined : undefined,
  tls: redis.protocol === "rediss:" ? {} : undefined
};

const worker = new Worker(
  "scan-ocr",
  async (job) => {
    const scanId = job.data.scanId as string;
    const scan = await prisma.scan.findUnique({ where: { id: scanId } });
    if (!scan) return;

    try {
      const imageBuffer = await fetchImageBuffer(scan.imageUrl);
      const result = await Tesseract.recognize(imageBuffer, "eng");
      const text = result?.data?.text ?? "";
      const parsed = parseNutrition(text);

      const food = await prisma.food.create({
        data: {
          name: `Scanned Food ${new Date().toLocaleDateString()}`,
          source: FoodSource.USER_SCAN,
          createdByUserId: scan.userId,
          servings: {
            create: {
              labelServingName: parsed.serving.label,
              gramsPerServing: parsed.serving.grams
            }
          },
          nutrition: {
            create: {
              caloriesPerServing: parsed.calories,
              proteinG: parsed.protein,
              carbsG: parsed.carbs,
              fatG: parsed.fat,
              fiberG: parsed.fiber ?? undefined,
              sugarG: parsed.sugar ?? undefined,
              sodiumMg: parsed.sodium ?? undefined
            }
          }
        }
      });

      await prisma.scan.update({
        where: { id: scanId },
        data: {
          ocrText: text,
          status: ScanStatus.PROCESSED,
          rawData: parsed,
          links: {
            create: {
              foodId: food.id,
              confidence: 0.7
            }
          }
        }
      });
    } catch (error: any) {
      await prisma.scan.update({
        where: { id: scanId },
        data: {
          status: ScanStatus.FAILED,
          ocrText: String(error?.message || error)
        }
      });
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Scan job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Scan job ${job?.id} failed`, err);
});
