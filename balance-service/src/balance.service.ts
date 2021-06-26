import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BalanceModel } from './balance.model';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { DEFAULT_TIMEOUT } from './types';
import { timeout } from 'rxjs/operators';
import { CreateBalanceDTO, UpdateBalanceDTO } from './balance.types';
import { Balance } from '@prisma/client';

@Injectable()
export class BalanceService {
  constructor(
    private readonly balanceModel: BalanceModel,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('TRANSACTION_SERVICE') private transactionClient: ClientProxy,
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

  async getSumOfTransactions(balanceUuid: string): Promise<number> {
    try {
      return this.transactionClient
        .send({ cmd: 'sum-of-transactions' }, balanceUuid)
        .pipe(timeout(DEFAULT_TIMEOUT))
        .toPromise();
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async createBalance(
    balanceData: CreateBalanceDTO,
    jwt: string,
  ): Promise<Balance> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      return await this.balanceModel.add({ ...balanceData, userUuid });
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async updateBalance(
    balanceData: UpdateBalanceDTO,
    jwt: string,
    balanceUuid: string,
  ): Promise<{ message: string }> {
    try {
      if (!(await this.balanceExists(balanceUuid))) {
        throw new NotFoundException('Balance not found.');
      }
      const userUuid = await this.getUserUuid(jwt);
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      await this.balanceModel.update(balanceData, balanceUuid);
      return {
        message: 'Balance has been updated.',
      };
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async findMany(jwt: string): Promise<Balance[]> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      return await this.balanceModel.findManyBy({ userUuid, isDeleted: false });
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async findOne(
    jwt: string,
    balanceUuid: string,
  ): Promise<Balance & { sumOfTransactions: number }> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      const balance = await this.balanceModel.findBy({
        uuid: balanceUuid,
      });
      if (!balance) throw new NotFoundException('Balance not found');
      const sumOfTransactions = await this.getSumOfTransactions(balanceUuid);
      return {
        ...balance,
        sumOfTransactions,
      };
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async balanceExists(balanceUuid: string): Promise<boolean> {
    try {
      return !!(await this.balanceModel.findBy({ uuid: balanceUuid }));
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async balanceForUserExists(
    userUuid: string,
    balanceUuid: string,
  ): Promise<boolean> {
    try {
      const balance = await this.balanceModel.findBy({ uuid: balanceUuid });
      if (!balance) throw new NotFoundException('Balance not found.');
      return balance.userUuid === userUuid && !balance.isDeleted;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async deleteBalance(
    jwt: string,
    balanceUuid: string,
  ): Promise<{ updatedAt: Date }> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!(await this.balanceForUserExists(userUuid, balanceUuid))) {
        throw new NotFoundException(
          'The balance does not have provided user uuid.',
        );
      }
      const { updatedAt } = await this.balanceModel.update(
        { isDeleted: true },
        balanceUuid,
      );
      return {
        updatedAt,
      };
    } catch ({ status, message }) {
      throw new HttpException(message, status);
    }
  }
}
