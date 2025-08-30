import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsDto } from './dto/order-products.dto';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity> ,
    @InjectRepository(OrdersProductsEntity) private readonly opRepository: Repository<OrdersProductsEntity> ,
    @Inject(forwardRef(()=> ProductsService)) private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto , currentUer: UserEntity): Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);
    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUer;
    const orderTbl = await this.orderRepository.save(orderEntity);
    let opEntity: {
      order: { id: number };
      product: { id: number };
      product_quantity: number,
      product_unit_price: number,
    }[] = [];
    for (const product of createOrderDto.orderedProducts) {
      opEntity.push({
        order: { id: orderTbl.id },
        product: {id: product.id},
        product_quantity: product.product_quantity,
        product_unit_price: product.product_unit_price,
      })
    }
    const op = await this.opRepository.createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();
    return this.findOne(+orderTbl.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product:true }
      }
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: {id},
      relations: {
        shippingAddress: true,
        user: true,
        products: { product:true }
      }
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

   async findOneByProductId(id: number) {
    return this.opRepository.findOne({
      relations: {product: true},
      where: {product: {id}}
    })
   }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto , currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(`Order already ${order.status}`);
    }
    if (order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status !== OrderStatus.SHIPPED) {
      throw new BadRequestException(`Delivery before Shipped!!!!`);
    }
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED && order.status === OrderStatus.SHIPPED) {
      return order;
    }
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order , OrderStatus.DELIVERED);
    }
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity , status: string) {
    for (const op of order.products) {
      await this.productsService.updateStock(op.product.id , op.product_quantity , status);
    }
  }

  async cancelled(id: number , currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (order.status === OrderStatus.CANCELLED) return order;
    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order , OrderStatus.CANCELLED);
    return order;
  }
}
