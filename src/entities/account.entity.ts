import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTION_KEYS } from 'src/database/collections';
import { Base } from './base.entity';

@Schema({ timestamps: true })
export class AccountEntity extends Base {
  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  location?: string;

  @Prop()
  platform?: string;
}

export type AccountDocument = AccountEntity & Document;
export const AccountSchema = SchemaFactory.createForClass(AccountEntity);
AccountSchema.set('collection', COLLECTION_KEYS.ACCOUNT);
