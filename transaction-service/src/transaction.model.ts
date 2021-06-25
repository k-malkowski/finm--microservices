import { Injectable } from '@nestjs/common';
import { PrismaService } from './db-client/prisma.service';
import { Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDTO } from './transaction.types';

@Injectable()
export class TransactionModel {
  constructor(private prisma: PrismaService) {}

  async add(
    transactionData: CreateTransactionDTO & { userUuid: string },
  ): Promise<Transaction> {
    try {
      return await this.prisma.transaction.create({
        data: transactionData,
      });
    } catch (e) {
      throw e;
    }
  }

  async update(
    fields: Prisma.TransactionUpdateInput,
    transactionUuid: string,
  ): Promise<Transaction> {
    try {
      return await this.prisma.transaction.update({
        where: {
          uuid: transactionUuid,
        },
        data: fields,
      });
    } catch (e) {
      throw e;
    }
  }

  async findMany(fields: Prisma.TransactionWhereInput): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: fields,
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(
    fields: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction> {
    try {
      return await this.prisma.transaction.findUnique({
        where: fields,
      });
    } catch (e) {
      throw e;
    }
  }
}
