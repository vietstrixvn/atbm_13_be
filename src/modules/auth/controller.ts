import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { HttpCode } from '@nestjs/common';
import { AuthService } from './service';
import { LogInDTO } from './login.dto';
import { AuthSuccess, UserResponse } from './constant';
import { LogInResponse } from './response';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthPublicController {
  private readonly logger = new Logger(AuthPublicController.name);

  constructor(
    private readonly service: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor(''))
  async login(
    @Body() dto: LogInDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogInResponse> {
    this.logger.debug('Login attempt for username:', dto.username);

    const result = await this.service.validateAttemptAndSignToken(dto);
    // Generate access token
    const accessToken = this.jwtService.sign(
      {
        _id: result.userInfo._id,
        name: result.userInfo.name,
        username: result.userInfo.username,
      },
      {
        expiresIn: '1d', // 1 day
      },
    );

    // Set cookies
    res.cookie('user_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return result;
  }

  // Update logout to clear both tokens
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: string; message: string }> {
    res.cookie('user_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return { status: 'success', message: AuthSuccess.LogoutSuccess };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req): Promise<UserResponse> {
    this.logger.debug('Getting info for current user:', req.user);
    const userId = req.user?.userId;

    if (!userId) {
      this.logger.error('User ID is missing in request');
      throw new BadRequestException('Invalid token: Missing user ID');
    }

    const user = await this.service.findByUuid(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
