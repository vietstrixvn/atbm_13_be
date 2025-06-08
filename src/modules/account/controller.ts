import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AccountService } from './service';
import { CreateDto } from './dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller({ path: 'account', version: '1' })
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBlogs(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    this.logger.debug('Fetching blogs with filters:', {
      startDate,
      endDate,
      page,
      limit,
    });

    try {
      return await this.accountService.findAll(
        { page, limit },
        startDate,
        endDate,
      );
    } catch (error) {
      this.logger.error('Error fetching account', error.stack);
      throw error;
    }
  }

  @Post()
  async create(@Body() createDto: CreateDto) {
    const blog = await this.accountService.create(createDto);

    return blog;
  }
}
