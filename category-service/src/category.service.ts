import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryModel } from './category.model';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { DEFAULT_TIMEOUT } from './types';
import { timeout } from 'rxjs/operators';
import { CreateCategoryDTO } from './category.types';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryModel: CategoryModel,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  async getUserUuid(jwt: string): Promise<string> {
    try {
      return await this.authClient
        .send({ cmd: 'check-jwt' }, jwt)
        .pipe(timeout(DEFAULT_TIMEOUT))
        .toPromise();
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async categoryForUserExists(
    categoryId: number,
    userUuid: string,
  ): Promise<boolean> {
    try {
      const category = await this.categoryModel.findOne({ id: categoryId });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category.userUuid === userUuid;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async createCategory(
    categoryData: CreateCategoryDTO,
    jwt: string,
  ): Promise<Category> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      return await this.categoryModel.add({ ...categoryData, userUuid });
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async updateCategory(
    fields: Prisma.CategoryUpdateInput,
    jwt: string,
    categoryId: number,
  ): Promise<Category> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!(await this.categoryForUserExists(Number(categoryId), userUuid))) {
        throw new NotFoundException(
          "Category for that user uuid doesn't exist",
        );
      }
      return await this.categoryModel.update(fields, Number(categoryId));
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async findMany(jwt: string): Promise<Category[]> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      return this.categoryModel.findMany({
        userUuid,
        isDeleted: false,
      });
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async deleteCategory(
    jwt: string,
    categoryId: number,
  ): Promise<{ updatedAt: Date }> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      const category = await this.categoryModel.findOne({
        id: Number(categoryId),
      });
      if (category.userUuid !== userUuid) {
        throw new NotFoundException(
          'The category does not have provided user uuid',
        );
      }
      const { updatedAt } = await this.categoryModel.update(
        {
          isDeleted: true,
        },
        Number(categoryId),
      );
      return {
        updatedAt,
      };
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }
}
