import { Expose, Transform, Type } from 'class-transformer';
import { Timestamp } from 'typeorm';

export class ProductsDto {
  @Expose()
  totalProducts: number;
  @Expose()
  limit: number;
  @Expose()
  @Type(()=> productList)
  products: productList[]
}

export class productList {
  @Expose({name: 'product_id'})
  id: number;
  @Expose({name: 'product_title'})
  title: string;
  @Expose({name: 'product_description'})
  description: string;
  @Expose({name: 'product_price'})
  price: number;
  @Expose({name: 'product_stock'})
  stock: number;
  @Expose({name: 'product_images'})
  @Transform(({value}) => value.toString().slice(","))
  images: string[];

  @Transform(({obj}) => {
    return {
      id: obj.category_id,
      title: obj.category_title,
    }
  })
  @Expose()
  category: any;

  @Expose({name: 'reviewcount'})
  reviewcount: number;
  @Expose({name: 'avgrating'})
  rating: number;
}