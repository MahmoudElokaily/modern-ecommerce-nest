import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,

} from 'typeorm';
import { Roles } from '../utility/common/user-roles.enum';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({unique: true})
  email: string;
  @Column({select: false})
  password: string;
  @Column({type: 'enum', enum: Roles , array: true, default: Roles[Roles.User]})
  roles: Roles[] = [Roles.User];
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @OneToMany(()=> CategoryEntity , (cat)=> cat.addedBy)
  categories: CategoryEntity[];
  @OneToMany(() => ProductEntity , (prod) => prod.addedBy)
  products: ProductEntity[];
}
