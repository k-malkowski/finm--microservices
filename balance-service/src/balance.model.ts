import { Injectable } from '@nestjs/common';
import { PrismaService } from './db-client/prisma.service';
import { Balance, Prisma } from '@prisma/client';

type CreateBalance = {
  name: string;
  currency: string;
};

@Injectable()
export class BalanceModel {
  constructor(private prisma: PrismaService) {}

  async add(balanceData: Prisma.BalanceCreateInput): Promise<Balance> {
    return await this.prisma.balance.create({
      data: {
        ...balanceData,
      },
    });
  }

  async findBy(
    fields: Prisma.BalanceWhereUniqueInput,
  ): Promise<Balance | null> {
    return await this.prisma.balance.findUnique({
      where: fields,
    });
  }

  async update(
    balanceData: Prisma.BalanceUpdateInput,
    balanceUuid: string,
  ): Promise<Balance> {
    return await this.prisma.balance.update({
      where: {
        uuid: balanceUuid,
      },
      data: balanceData,
    });
  }

  async findManyBy(
    fields: Prisma.BalanceWhereInput,
  ): Promise<Balance[] | null> {
    return await this.prisma.balance.findMany({
      where: fields,
    });
  }
}
