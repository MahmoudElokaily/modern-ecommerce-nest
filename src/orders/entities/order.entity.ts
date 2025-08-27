import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { ShippingEntity } from './shipping.entity';
import { OrdersProductsEntity } from './orders-products.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING})
  status: string;
  @Column({nullable: true})
  shippedAt: Date;
  @Column({nullable: true})
  deliveredAt: Date;
  @CreateDateColumn()
  orderAt: Timestamp;
  @ManyToOne(() => UserEntity, user => user.ordersUpdateBy)
  updatedBy: UserEntity;
  @OneToOne(() => ShippingEntity, (ship) => ship.order , {cascade: true})
  @JoinColumn()
  shippingAddress: ShippingEntity;
  @OneToMany(()=> OrdersProductsEntity , (op) => op.order , {cascade: true})
  products: OrdersProductsEntity[];

  @ManyToOne(() => UserEntity , (user) => user.orders)
  user: UserEntity;
}
