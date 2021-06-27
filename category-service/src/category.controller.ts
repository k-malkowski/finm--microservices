import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './category.types';
import { Request as RequestType } from 'express';
import { MessagePattern } from '@nestjs/microservices';

@Controller('api/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  async create(
    @Body() categoryData: CreateCategoryDTO,
    @Request() req: RequestType,
  ) {
    return await this.categoryService.createCategory(
      categoryData,
      req.headers.authorization,
    );
  }

  @Put(':categoryId')
  async update(
    @Body() categoryData: UpdateCategoryDTO,
    @Request() req: RequestType,
    @Param() params: { categoryId: number },
  ) {
    return await this.categoryService.updateCategory(
      categoryData,
      req.headers.authorization,
      params.categoryId,
    );
  }

  @Get('')
  async findMany(@Request() req: RequestType) {
    return await this.categoryService.findMany(req.headers.authorization);
  }

  @Delete(':categoryId')
  async delete(
    @Request() req: RequestType,
    @Param() params: { categoryId: number },
  ) {
    return await this.categoryService.deleteCategory(
      req.headers.authorization,
      params.categoryId,
    );
  }

  @MessagePattern({ cmd: 'category-for-user-exists' })
  async categoryForUserExists({
    userUuid,
    categoryId,
  }: {
    userUuid: string;
    categoryId: number;
  }) {
    return await this.categoryService.categoryForUserExists(
      categoryId,
      userUuid,
    );
  }
}
