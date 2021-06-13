import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './users.model';
import { PrismaService } from './db-client/prisma.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, PrismaService, UsersModel],
  controllers: [UsersController],
})
export class UsersModule {}
