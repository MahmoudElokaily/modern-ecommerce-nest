import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';
import { Roles } from '../utility/common/user-roles.enum';

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
}
