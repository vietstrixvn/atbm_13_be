import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppBaseController } from './app.base.controller';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { AppService } from './app.service';
import { ApiKeyMiddleware } from 'src/middlewares/api-key.middleware';
import { AuthModule } from 'src/modules/auth/module';
import { AccountModule } from 'src/modules/account/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,
    ScheduleModule.forRoot(),
    AuthModule,
    AccountModule,
  ],
  controllers: [AppBaseController],
  providers: [
    {
      provide: 'app',
      useClass: AppService,
    },
    ApiKeyMiddleware,
  ],
})
export class AppModule {}
