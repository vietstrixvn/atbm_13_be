import { AccountDocument } from 'src/entities/account.entity';

export interface DataResponse {
  _id: string;
  username: string;
  password: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResponse {
  status: string;
  result: AccountDocument;
}
