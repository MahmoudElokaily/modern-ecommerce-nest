import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isArray } from 'class-validator';
import { verify , type Secret } from 'jsonwebtoken';
import * as process from 'node:process';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity | null;
    }
  }
}


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
        req.currentUser = null;
        next();
        return;
    }
    else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as Secret) as JwtPayload;
        const currentUser = await this.usersService.findOne(+id);
        req.currentUser = currentUser;
        next();
      } catch (error) {
        req.currentUser = null;
        next();
      }
    }
  }
}
interface JwtPayload {
  id: string;
}