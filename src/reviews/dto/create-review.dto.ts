import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product should not be empty'})
  @IsNumber({} , { message: 'Product id should be number'})
  productId: number;
  @IsNotEmpty({ message: 'Rating should not be empty'})
  @IsNumber({} , { message: 'Rating should be number'})
  ratings: number;
  @IsNotEmpty({ message: 'Comment should not be empty'})
  @IsString()
  comment: string;
}
