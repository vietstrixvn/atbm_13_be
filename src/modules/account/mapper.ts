import { AccountDocument } from 'src/entities/account.entity';
import { DataResponse } from './response';

export function toDataResponse(blog: Partial<AccountDocument>): DataResponse {
  return {
    _id: blog._id?.toString() ?? '',
    username: blog.username ?? '',
    password: blog.password ?? '',
    ipAddress: blog.ipAddress ?? '',
    userAgent: blog.userAgent ?? '',
    location: blog.location ?? '',
    platform: blog.platform ?? '',
    createdAt: blog.createdAt ?? new Date(),
    updatedAt: blog.updatedAt ?? new Date(),
  };
}
