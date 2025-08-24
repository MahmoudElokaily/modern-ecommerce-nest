import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) {
  }
  async create(createCategoryDto: CreateCategoryDto , currentUser: UserEntity): Promise<CategoryEntity> {
    const category = await this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      relations: {addedBy: true},
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        }
      }
    });
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {id: id},
      relations: {addedBy: true},
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        }
      }
    });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }

  async update(id: number, fields:Partial<UpdateCategoryDto>): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException("Category not found");
    Object.assign(category, fields);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException("Category not found");
    return await this.categoryRepository.delete(id);
  }
}
