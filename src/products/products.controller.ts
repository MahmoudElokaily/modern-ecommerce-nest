import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from '../users/utility/guards/authentication.guard';
import { AuthorizeGuard } from '../users/utility/guards/authorization.guard';
import { Roles } from '../users/utility/common/user-roles.enum';
import { CurrentUserDecorator } from '../users/utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Post()
  async create(@Body() createProductDto: CreateProductDto , @CurrentUserDecorator() currentUser: UserEntity) {
    return this.productsService.create(createProductDto , currentUser);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
