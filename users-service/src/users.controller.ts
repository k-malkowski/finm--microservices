import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma, User } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.types';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create-user' })
  async createUser(userData: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userData);
  }

  @MessagePattern({ cmd: 'find-user' })
  async findUser(fields: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.usersService.findOne(fields);
  }
}
