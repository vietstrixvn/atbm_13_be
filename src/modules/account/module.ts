import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/module';
import { AccountEntity, AccountSchema } from 'src/entities/account.entity';
import { AccountService } from './service';
import { AccountController } from './controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountEntity.name, schema: AccountSchema },
    ]),
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
