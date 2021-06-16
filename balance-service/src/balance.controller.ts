import { Body, Controller, Post, Request } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDTO } from './balance.types';
import { Request as RequestType } from 'express';

@Controller('api/v1/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('')
  async register(
    @Body() balanceData: CreateBalanceDTO,
    @Request() req: RequestType,
  ) {
    return this.balanceService.createBalance(
      balanceData,
      req.headers.authorization,
    );
  }
}
