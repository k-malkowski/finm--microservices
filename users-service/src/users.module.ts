import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './users.model';
import { PrismaService } from './db-client/prisma.service';

@Module({
  providers: [UsersService, PrismaService, UsersModel],
})
export class UsersModule {}
