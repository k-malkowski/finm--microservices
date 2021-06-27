import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from './db-client/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionModel } from './transaction.model';

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
      {
        name: 'BALANCE_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3022,
          host: '127.0.0.1',
        },
      },
      {
        name: 'CATEGORY_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3024,
          host: '127.0.0.1',
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, TransactionModel],
})
export class TransactionModule {}
