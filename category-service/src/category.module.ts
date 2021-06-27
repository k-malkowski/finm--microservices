import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from './db-client/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CategoryModel } from './category.model';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3021,
          host: '127.0.0.1',
        },
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, CategoryModel],
})
export class CategoryModule {}
