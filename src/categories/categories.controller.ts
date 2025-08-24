import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUserDecorator } from '../users/utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationGuard } from '../users/utility/guards/authentication.guard';
import { Roles } from '../users/utility/common/user-roles.enum';
import { AuthorizeGuard } from '../users/utility/guards/authorization.guard';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto , @CurrentUserDecorator() currentUser: UserEntity): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto , currentUser);
  }

  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity>  {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.categoriesService.remove(+id);
    if (deleted) {
      return { message: "Category deleted successfully" };
    }
    return { message: "Category not found" };
  }
}
