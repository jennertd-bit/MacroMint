import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

const parseOrigins = (value?: string): string[] =>
  (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: true });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter
  );

  // Override JSON parser AFTER NestJS registers its own, so we can store
  // the raw body buffer needed for Stripe webhook signature verification
  const fastify = adapter.getInstance();
  fastify.removeAllContentTypeParsers();
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (req: any, body: Buffer, done: (err: any, payload?: any) => void) => {
      (req as any).rawBody = body;
      try {
        done(null, JSON.parse(body.toString("utf8")));
      } catch (err) {
        done(err);
      }
    }
  );

  app.setGlobalPrefix("v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const allowed = parseOrigins(process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "");
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowed.length === 0) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, "0.0.0.0");
}

bootstrap();
