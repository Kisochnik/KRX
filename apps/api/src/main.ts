import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: Number(config.get("RATE_LIMIT_WINDOW_MS", 60_000)),
      limit: Number(config.get("RATE_LIMIT_MAX", 120)),
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );
  app.enableCors({
    origin: config.get("WEB_ORIGIN", "http://localhost:3000"),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();

  const port = Number(config.get("API_PORT", 4000));
  await app.listen(port);
}

void bootstrap();
