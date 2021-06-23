import {
  Body,
  Controller, Param,
  Post, Put,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO, UpdateTransactionDTO } from './transaction.types';
import { Request as RequestType } from 'express';

@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('')
  async create(
    @Body() transactionData: CreateTransactionDTO,
    @Request() req: RequestType,
  ) {
    return this.transactionService.createTransaction(
      transactionData,
      req.headers.authorization,
    );
  }

  @Put(':transactionUuid/balanceUuid/:balanceUuid')
  async update(
    @Body() transactionData: UpdateTransactionDTO,
    @Request() req: RequestType,
    @Param() params: { transactionUuid: string, balanceUuid: string }
  ) {
    return this.transactionService.updateTransaction(
      transactionData,
      req.headers.authorization,
      params.transactionUuid,
      params.balanceUuid
    );
  }
}
