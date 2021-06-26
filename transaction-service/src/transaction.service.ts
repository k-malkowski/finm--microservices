import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionModel } from './transaction.model';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { DEFAULT_TIMEOUT } from './types';
import { timeout } from 'rxjs/operators';
import { CreateTransactionDTO } from './transaction.types';
import { Transaction, Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionModel: TransactionModel,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('BALANCE_SERVICE') private balanceClient: ClientProxy,
  ) {}

  async getUserUuid(jwt: string): Promise<string> {
    try {
      return await this.authClient
        .send({ cmd: 'check-jwt' }, jwt)
        .pipe(timeout(DEFAULT_TIMEOUT))
        .toPromise();
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async balanceForUserExists(
    userUuid: string,
    balanceUuid: string,
  ): Promise<boolean> {
    try {
      return await this.balanceClient
        .send({ cmd: 'balance-exists' }, { userUuid, balanceUuid })
        .pipe(timeout(DEFAULT_TIMEOUT))
        .toPromise();
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async createTransaction(
    transactionData: CreateTransactionDTO,
    jwt: string,
  ): Promise<Transaction> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (
        !(await this.balanceForUserExists(
          userUuid,
          transactionData.balanceUuid,
        ))
      ) {
        throw new NotFoundException("Balance for that user uuid doesn't exist");
      }
      return await this.transactionModel.add({ ...transactionData, userUuid });
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async updateTransaction(
    fields: Prisma.TransactionUpdateInput,
    jwt: string,
    transactionUuid: string,
    balanceUuid: string,
  ): Promise<Transaction> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!(await this.balanceForUserExists(userUuid, balanceUuid))) {
        throw new NotFoundException("Balance for that user uuid doesn't exist");
      }
      return await this.transactionModel.update(fields, transactionUuid);
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async findMany(
    jwt: string,
    balanceUuid: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<Transaction[]> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!(await this.balanceForUserExists(userUuid, balanceUuid))) {
        throw new NotFoundException('Balance for that user uuid doesnt exist');
      }
      return this.transactionModel.findMany({
        balanceUuid,
        transactionMadeAt: { gte: new Date(dateFrom), lt: new Date(dateTo) },
        isDeleted: false,
      });
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async deleteTransaction(
    jwt: string,
    transactionUuid: string,
  ): Promise<{ updatedAt: Date }> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      const transaction = await this.transactionModel.findOne({
        uuid: transactionUuid,
      });
      if (transaction.userUuid !== userUuid) {
        throw new NotFoundException(
          'The transaction does not have provided user uuid',
        );
      }
      const { updatedAt } = await this.transactionModel.update(
        {
          isDeleted: true,
        },
        transactionUuid,
      );
      return {
        updatedAt,
      };
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async getSumOfTransactions(balanceUuid): Promise<number> {
    try {
      const transactions = await this.transactionModel.findMany({
        balanceUuid,
        isDeleted: false,
      });
      const sumOfTransactions = transactions.reduce(
        (prev, { amount }) => prev + amount,
        0,
      );
      return sumOfTransactions;
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
