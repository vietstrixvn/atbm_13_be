import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  ipAddress: string;

  @IsString()
  userAgent: string;

  @IsString()
  location: string;

  @IsString()
  platform: string;
}
