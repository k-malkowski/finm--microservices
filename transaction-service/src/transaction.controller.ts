import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDTO,
  FindManyQueryDTO,
  UpdateTransactionDTO,
} from './transaction.types';
import { Request as RequestType } from 'express';
import { MessagePattern } from '@nestjs/microservices';

@Controller('api/v1/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('')
  async create(
    @Body() transactionData: CreateTransactionDTO,
    @Request() req: RequestType,
  ) {
    return await this.transactionService.createTransaction(
      transactionData,
      req.headers.authorization,
    );
  }

  @Put(':transactionUuid/balanceUuid/:balanceUuid')
  async update(
    @Body() transactionData: UpdateTransactionDTO,
    @Request() req: RequestType,
    @Param() params: { transactionUuid: string; balanceUuid: string },
  ) {
    return await this.transactionService.updateTransaction(
      transactionData,
      req.headers.authorization,
      params.transactionUuid,
      params.balanceUuid,
    );
  }

  @Get(':balanceUuid')
  async findMany(
    @Request() req: RequestType,
    @Param() params: { balanceUuid: string },
    @Query() query: FindManyQueryDTO,
  ) {
    return await this.transactionService.findMany(
      req.headers.authorization,
      params.balanceUuid,
      query.dateFrom,
      query.dateTo,
    );
  }

  @MessagePattern({ cmd: 'sum-of-transactions' })
  async getSumOfTransactions(balanceUuid: string) {
    return await this.transactionService.getSumOfTransactions(balanceUuid);
  }

  @Delete(':transactionUuid')
  async delete(
    @Request() req: RequestType,
    @Param() params: { transactionUuid: string },
  ) {
    return await this.transactionService.deleteTransaction(
      req.headers.authorization,
      params.transactionUuid,
    );
  }
}
