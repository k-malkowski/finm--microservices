import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UsersModel } from './users.model';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './users.types';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersModel: UsersModel) {}

  async findOne(fields: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      return await this.usersModel.findBy(fields);
    } catch (e) {
      throw e;
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      if (await this.usernameExists(userData.username)) {
        throw new ConflictException('Username already exists.');
      } else if (await this.emailExists(userData.email)) {
        throw new ConflictException('Email already exists');
      }
      const { password, ...result } = userData;
      const userDataWithHashedPassword = {
        ...result,
        password: await hash(password, Number(process.env.SALT)),
      };
      return await this.usersModel.add(userDataWithHashedPassword);
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      return !!(await this.usersModel.findBy({ email }));
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
  async usernameExists(username: string): Promise<boolean> {
    try {
      return !!(await this.usersModel.findBy({ username }));
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
