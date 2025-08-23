import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({message: "title can't be empty."})
  @IsString()
  title:string;
  @IsNotEmpty({message: "Description can't be empty."})
  @IsString()
  description:string;
  @IsNotEmpty({message: "price can't be empty."})
  @IsNumber({maxDecimalPlaces:2} , {message: "price should be number & max decimal precision 2."})
  @IsPositive({message: "Price should be positive number."})
  price:number;

  @IsNotEmpty({message: "Stock can't be empty."})
  @IsNumber({} , {message: "price should be number & max decimal precision 2."})
  @Min(0 , {message: "Stock can't be negative."})
  stock:number;
  @IsNotEmpty({message: "Images can't be empty."})
  @IsArray({message: "Images should be in array format."})
  images:string[];
  @IsNotEmpty({message: "Category can't be empty."})
  @IsNumber({} , {message: "Category id should be number"})
  categoryId:number;
}
