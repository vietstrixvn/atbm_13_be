import * as dotenv from 'dotenv';
dotenv.config();

export const COLLECTION_KEYS = {
  ACCOUNT: process.env.ACCOUNT_COLLECTION || 'accounts',
  AUTH: process.env.AUTH_COLLECTION || 'auth',
};
