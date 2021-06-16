import { Injectable } from '@nestjs/common';
import { PrismaService } from './db-client/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersModel {
  constructor(private prisma: PrismaService) {}

  async add(userData: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...userData,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async findBy(fields: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: fields,
      });
    } catch (e) {
      throw e;
    }
  }
}
