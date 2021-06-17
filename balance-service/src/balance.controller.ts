import { Body, Controller, Param, Post, Put, Request } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDTO, UpdateBalanceDTO } from './balance.types';
import { Request as RequestType } from 'express';

@Controller('api/v1/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('')
  async create(
    @Body() balanceData: CreateBalanceDTO,
    @Request() req: RequestType,
  ) {
    return this.balanceService.createBalance(
      balanceData,
      req.headers.authorization,
    );
  }

  @Put(':balanceUuid')
  async update(
    @Body() balanceData: UpdateBalanceDTO,
    @Request() req: RequestType,
    @Param('balanceUuid') balanceUuid: string,
  ) {
    return this.balanceService.updateBalance(
      balanceData,
      req.headers.authorization,
      balanceUuid,
    );
  }
}
