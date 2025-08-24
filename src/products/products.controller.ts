import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from '../users/utility/guards/authentication.guard';
import { AuthorizeGuard } from '../users/utility/guards/authorization.guard';
import { Roles } from '../users/utility/common/user-roles.enum';
import { CurrentUserDecorator } from '../users/utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Post()
  async create(@Body() createProductDto: CreateProductDto , @CurrentUserDecorator() currentUser: UserEntity) {
    return this.productsService.create(createProductDto , currentUser);
  }

  @Get()
  async findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto , @CurrentUserDecorator() currentUser: UserEntity) {
    return this.productsService.update(+id, updateProductDto ,currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
