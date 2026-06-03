import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DATABASE_HOST", "localhost"),
        port: Number(config.get("DATABASE_PORT", 5432)),
        username: config.get("DATABASE_USER", "krx"),
        password: config.get("DATABASE_PASSWORD", "krx_password"),
        database: config.get("DATABASE_NAME", "krx"),
        autoLoadEntities: true,
        synchronize: false,
        ssl:
          config.get("DATABASE_SSL", "false") === "true"
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
  ],
})
export class DatabaseModule {}
