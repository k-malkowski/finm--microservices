import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { PrismaService } from './db-client/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BalanceModel } from './balance.model';

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
        name: 'TRANSACTION_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3023,
          host: '127.0.0.1',
        },
      },
    ]),
  ],
  controllers: [BalanceController],
  providers: [BalanceService, PrismaService, BalanceModel],
})
export class BalanceModule {}
