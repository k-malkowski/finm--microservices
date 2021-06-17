import { Injectable } from '@nestjs/common';
import { PrismaService } from './db-client/prisma.service';
import { Balance, Prisma } from '@prisma/client';
import { UpdateBalanceDTO } from './balance.types';

type CreateBalance = {
  value: number;
  name: string;
  currency: string;
};

@Injectable()
export class BalanceModel {
  constructor(private prisma: PrismaService) {}

  async add(balanceData: CreateBalance, userUuid: string): Promise<Balance> {
    return await this.prisma.balance.create({
      data: {
        ...balanceData,
        userUuid,
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
    balanceData: UpdateBalanceDTO,
    balanceUuid: string,
  ): Promise<Balance> {
    return await this.prisma.balance.update({
      where: {
        uuid: balanceUuid,
      },
      data: balanceData,
    });
  }
}
