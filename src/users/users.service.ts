import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import {hash , compare} from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, type Secret , type SignOptions } from 'jsonwebtoken';
import * as process from 'node:process';
import { config } from 'dotenv';


config();


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private  userRepository: Repository<UserEntity>,
  ) {
  }

  async signup(userSignupDto: UserSignupDto):  Promise<UserEntity>  {
    const userExists = await this.findUserByEmail(userSignupDto.email);
    if (userExists) throw new BadRequestException('Email is not available');
    userSignupDto.password = await hash(userSignupDto.password , 10);
    let user = this.userRepository.create(userSignupDto);
    user =  await this.userRepository.save(user);
    delete (user as any).password;
    return user;
  }

  async signin(userSigninDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.userRepository.createQueryBuilder('users')
      .addSelect('users.password').where('users.email = :email' , {email: userSigninDto.email}).getOne();
    if (!userExists) throw new BadRequestException('Bad Credentials.');
    const matchPassword = await compare(userSigninDto.password, userExists.password);
    if (!matchPassword) throw new BadRequestException('Bad Credentials.');
    delete (userExists as any).password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({email});
  }

  async accessToken(user): Promise<string> {
    const rawExp = process.env.ACCESS_TOKEN_EXPIRE_TIME?.trim(); // مثال: "30m" أو "3600"
    const options: SignOptions = {};

    if (rawExp && rawExp.length > 0) {
      const asNum = Number(rawExp);
      options.expiresIn = Number.isFinite(asNum)
        ? asNum // ثواني
        : (rawExp as SignOptions['expiresIn']); // مثل "30m", "1h", "2d"
    } else {
      options.expiresIn = 3600; // افتراضي: ساعة
    }    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
      options
    );
  }
}
