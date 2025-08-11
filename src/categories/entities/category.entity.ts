import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

// @ts-ignore
@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @CreateDateColumn()
  created_at: Timestamp;
  @UpdateDateColumn()
  updated_at: Timestamp;
  @ManyToOne(() => UserEntity, (user) => user.categories , { eager: true })
  addedBy;UserEntity;
}
