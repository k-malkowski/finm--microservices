import { Injectable } from '@nestjs/common';
import { PrismaService } from './db-client/prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryModel {
  constructor(private prisma: PrismaService) {}

  async add(
    categoryData: Prisma.CategoryCreateInput,
  ): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data: categoryData,
      });
    } catch (e) {
      throw e;
    }
  }

  async update(
    fields: Prisma.CategoryUpdateInput,
    categoryId: number,
  ): Promise<Category> {
    try {
      return await this.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: fields,
      });
    } catch (e) {
      throw e;
    }
  }

  async findMany(fields: Prisma.CategoryWhereInput): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: fields,
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(
    fields: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    try {
      return await this.prisma.category.findUnique({
        where: fields,
      });
    } catch (e) {
      throw e;
    }
  }
}
