import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthorizeGuard } from '../users/utility/guards/authorization.guard';
import { Roles } from '../users/utility/common/user-roles.enum';
import { AuthenticationGuard } from '../users/utility/guards/authentication.guard';
import { CurrentUserDecorator } from '../users/utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto , @CurrentUserDecorator() currentUser: UserEntity): Promise<ReviewEntity> {
    return this.reviewsService.create(createReviewDto , currentUser);
  }

  @Get('all')
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get('/product/:productId/')
  async findAllByProduct(@Param('productId') productId: string): Promise<ReviewEntity[]> {
    return this.reviewsService.findAllByProduct(+productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewEntity> {
    return this.reviewsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
