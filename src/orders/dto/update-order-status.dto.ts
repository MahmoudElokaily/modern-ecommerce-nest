import { OrderStatus } from '../enums/order-status.enum';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatus.SHIPPED , OrderStatus.DELIVERED])
  status: OrderStatus;
}