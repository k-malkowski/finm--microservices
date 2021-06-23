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
    @Inject('AUTH_SERVICE') private client: ClientProxy,
  ) {}

  async getUserUuid(jwt: string): Promise<string> {
    try {
      return await this.client
        .send({ cmd: 'check-jwt' }, jwt)
        .pipe(timeout(DEFAULT_TIMEOUT))
        .toPromise();
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async createBalance(
    balanceData: CreateBalanceDTO,
    jwt: string,
  ): Promise<{ createdAt: Date; message: string }> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      const { createdAt } = await this.balanceModel.add(balanceData, userUuid);
      return {
        createdAt,
        message: 'Balance has been created.',
      };
    } catch (err) {
      const { message, status } = err;
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
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findMany(jwt: string): Promise<Balance[]> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      return await this.balanceModel.findManyBy({ userUuid });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findOne(jwt: string, balanceUuid: string): Promise<Balance> {
    try {
      const userUuid = await this.getUserUuid(jwt);
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      const balance = await this.balanceModel.findBy({ uuid: balanceUuid });
      if (!balance) throw new NotFoundException('Balance not found');
      return balance;
    } catch (err) {
      const { message, status } = err;
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
      return balance.userUuid === userUuid;
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
