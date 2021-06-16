import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BalanceModel } from './balance.model';
import { ClientProxy } from '@nestjs/microservices';
import { DEFAULT_TIMEOUT } from './types';
import { timeout } from 'rxjs/operators';
import { CreateBalanceDTO } from './balance.types';

@Injectable()
export class BalanceService {
  constructor(
    private readonly balanceModel: BalanceModel,
    @Inject('AUTH_SERVICE') private client: ClientProxy,
  ) {}
  async createBalance(
    balanceData: CreateBalanceDTO,
    jwt: string,
  ): Promise<{ createdAt: Date; message: string }> {
    try {
      const userUuid = await this.client
        .send({ cmd: 'check-jwt' }, jwt)
        .pipe(timeout(DEFAULT_TIMEOUT))
        .toPromise();
      if (!userUuid) {
        throw new NotFoundException('User not found.');
      }
      const { createdAt } = await this.balanceModel.add(balanceData, userUuid);
      return {
        createdAt,
        message: 'Created balance has been created.',
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
