import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn, Timestamp, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  ratings: number;
  @Column()
  comment: string;
  @ManyToOne(type => UserEntity , (user) => user.reviews)
  user: UserEntity;
  @ManyToOne(type => ProductEntity, (product) => product.reviews)
  product: ProductEntity;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
}
