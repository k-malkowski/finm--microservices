import { Injectable } from '@nestjs/common';
import { PrismaService } from './db-client/prisma.service';
import { Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDTO } from './transaction.types';


@Injectable()
export class TransactionModel {
  constructor(private prisma: PrismaService) {}

  async add(transactionData: CreateTransactionDTO): Promise<Transaction> {
    return await this.prisma.transaction.create({
      data: transactionData
    });
  }

  async update(fields: Prisma.TransactionUpdateInput, transactionUuid: string): Promise<Transaction> {
    return await this.prisma.transaction.update({
      where: {
        uuid: transactionUuid
      },
      data: fields
    })
  }
}
