import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateShippingDto } from './create-shipping.dto';
import { OrdersProductsDto } from './order-products.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrdersProductsDto)
  @ValidateNested()
  orderedProducts: OrdersProductsDto[];

}
