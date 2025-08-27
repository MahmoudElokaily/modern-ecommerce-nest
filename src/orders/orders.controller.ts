import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from '../users/utility/guards/authentication.guard';
import { CurrentUserDecorator } from '../users/utility/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { AuthorizeGuard } from '../users/utility/guards/authorization.guard';
import { Roles } from '../users/utility/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import * as path from 'node:path';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto , @CurrentUserDecorator() currentUer: UserEntity): Promise<OrderEntity> {
    return this.ordersService.create(createOrderDto , currentUer);
  }

  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderEntity> {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto , @CurrentUserDecorator() currentUser: UserEntity): Promise<OrderEntity> {
    return this.ordersService.update(+id, updateOrderStatusDto , currentUser);
  }

  @UseGuards(AuthenticationGuard , AuthorizeGuard([Roles.Admin]))
  @Patch('cancel/:id')
  async cancelled(@Param('id') id: string, @CurrentUserDecorator() currentUser: UserEntity): Promise<OrderEntity> {
    return this.ordersService.cancelled(+id , currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

}
