import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppBaseController } from "./app.base.controller";
import { ScheduleModule } from "@nestjs/schedule";
import { DatabaseModule } from "src/database/database.module";
import { AppService } from "./app.service";
import { AuthModule } from "src/modules/auth/module";
import { AccountModule } from "src/modules/account/module";
import { CorsMiddleware } from "src/middlewares/cors.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    DatabaseModule,
    ScheduleModule.forRoot(),
    AuthModule,
    AccountModule,
  ],
  controllers: [AppBaseController],
  providers: [
    {
      provide: "app",
      useClass: AppService,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Request logger middleware

    consumer.apply(CorsMiddleware).forRoutes("*");
  }
}
