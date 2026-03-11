import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private readonly connection: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    tls?: Record<string, unknown>;
  } | null = null;
  private readonly scanQueue: Queue | null = null;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>("REDIS_URL");
    if (!redisUrl) {
      this.logger.warn("REDIS_URL not set; queue features are disabled.");
      return;
    }

    try {
      const url = new URL(redisUrl);
      const allowLocalRedis = this.config.get<string>("ALLOW_LOCAL_REDIS") === "true";
      const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
      const isProd = this.config.get<string>("NODE_ENV") === "production";

      if (isProd && isLocalHost && !allowLocalRedis) {
        this.logger.error(
          "REDIS_URL points to localhost in production. Queue features are disabled until REDIS_URL is explicitly set."
        );
        return;
      }

      this.connection = {
        host: url.hostname,
        port: Number(url.port || 6379),
        password: url.password || undefined,
        db: url.pathname ? Number(url.pathname.replace("/", "")) || undefined : undefined,
        tls: url.protocol === "rediss:" ? {} : undefined
      };
      this.scanQueue = new Queue("scan-ocr", { connection: this.connection });
      this.scanQueue.on("error", (error) => {
        this.logger.error(`Queue error: ${String(error?.message || error)}`);
      });
    } catch (error: any) {
      this.logger.error(`Invalid REDIS_URL or queue init failure: ${String(error?.message || error)}`);
    }
  }

  async enqueueScan(scanId: string) {
    if (!this.scanQueue) return null;
    return this.scanQueue.add("process", { scanId });
  }

  getScanQueue() {
    return this.scanQueue;
  }

  getConnection() {
    return this.connection;
  }
}
