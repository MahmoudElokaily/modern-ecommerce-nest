import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrdersProductsDto {
  @IsNotEmpty({ message: "Product can't be empty." })
  id: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price should be number & max decimal precision 2" })
  @IsPositive({message: "Price can't be negative"})
  product_unit_price: number;
  @IsNumber({}, { message: "Quantity should be number" })
  @IsPositive({message: "Quantity can't be negative"})
  product_quantity: number;
}