import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

// Entity
import { User, UserDocument } from '../../entities/user.entity';

// Components
import { LogInDTO } from './login.dto';
import { LogInResponse } from './response';
import { AuthError, AuthSuccess, UserResponse } from './constant';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createAdminAccount();
  }

  private async createAdminAccount() {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');

    try {
      const existingAdmin = await this.userModel.findOne(
        { username: adminUsername },
        '_id',
      );

      if (existingAdmin?._id) {
        this.logger.log(`Admin already exists: ${adminUsername}`);
        return;
      }

      const admin = new this.userModel({
        username: adminUsername,
        password: this.configService.get<string>('ADMIN_PASSWORD'),
        email: this.configService.get<string>('ADMIN_EMAIL'),
        name: this.configService.get<string>('ADMIN_NAME'),
      });

      const savedAdmin = await admin.save();
      this.logger.log(
        `[SUCCESS] Admin created successfully with ID: ${savedAdmin._id}`,
      );
    } catch (error) {
      this.logger.error('Error creating admin account', error);
      throw error;
    }
  }

  async validateAttemptAndSignToken(dto: LogInDTO): Promise<LogInResponse> {
    if (!dto.password || typeof dto.password !== 'string') {
      throw new BadRequestException(AuthError.PasswordRequired);
    }

    const user = await this.userModel.findOne({
      username: dto.username,
    });

    if (!user || !user.password) {
      throw new BadRequestException(AuthError.InvalidLoginCredentials);
    }

    const isValidPassword = await user.comparePassword(dto.password);
    if (!isValidPassword) {
      throw new BadRequestException(AuthError.InvalidLoginCredentials);
    }

    return {
      status: 'success',
      message: AuthSuccess.LoginSuccess,
      userInfo: {
        _id: user._id.toString(),
        username: user.username,
        name: user.name,
      },
    };
  }

  private toDataResponse(user: Record<string, any>): User {
    return {
      _id: user._id?.toString() ?? '',
      name: user.name ?? '',
      username: user.username ?? '',
      email: user.email ?? '',
      password: user.password ?? '',
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
    };
  }

  async findByUuid(_id: string): Promise<UserResponse | null> {
    const user = await this.userModel.findById(_id).lean();
    if (!user) {
      return null;
    }

    const response = this.toDataResponse(user);

    const userResponse: UserResponse = {
      status: 'success',
      message: 'User found successfully',
      data: {
        _id: response._id,
        name: response.name,
        username: response.username,
        email: response.email,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      },
    };

    return userResponse;
  }
}
