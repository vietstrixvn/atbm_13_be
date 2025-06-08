import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pagination } from '../paginate/pagination';
import { PaginationOptionsInterface } from '../paginate/pagination.options.interface';
import { CreateDto } from './dto';
import { CreateResponse, DataResponse } from './response';
import { AccountDocument, AccountEntity } from 'src/entities/account.entity';
import { toDataResponse } from './mapper';
import { buildFilter } from './helper';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectModel(AccountEntity.name)
    private readonly accoutModel: Model<AccountDocument>,
  ) {}

  async findAll(
    options: PaginationOptionsInterface,
    startDate?: string,
    endDate?: string,
  ): Promise<Pagination<DataResponse>> {
    const filter = buildFilter({ startDate, endDate });

    const [blogs, total] = await Promise.all([
      this.accoutModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit),
      this.accoutModel.countDocuments(filter),
    ]);

    const results = blogs.map(toDataResponse);
    const result = new Pagination<DataResponse>({
      results,
      total,
      total_page: Math.ceil(total / options.limit),
      page_size: options.limit,
      current_page: options.page,
    });

    return result;
  }

  async create(createDto: CreateDto): Promise<CreateResponse> {
    const { username, password, ipAddress, userAgent, location, platform } =
      createDto;

    // Validate title
    if (!username || username.trim() === '') {
      throw new BadRequestException({
        message: 'Username is required',
        error: 'Username is required',
      });
    }

    if (!password)
      throw new BadRequestException({
        message: 'Password is required',
        error: 'Password is required',
      });

    // Create blog object
    const newAccount = new this.accoutModel({
      username,
      password,
      ipAddress,
      userAgent,
      location,
      platform,
    });

    try {
      this.logger.log('Cleared blog-related cache entries after create');
    } catch (error) {
      this.logger.error('Failed to clear cache after blog creation', error);
    }
    // Save blog and clear cache
    const savedBlog = await newAccount.save();

    // Clear cache related to blogs

    return {
      status: 'SUCCESS',
      result: savedBlog,
    };
  }
}
