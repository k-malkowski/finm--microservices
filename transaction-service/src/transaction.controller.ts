import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDTO,
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
  ) {
    return await this.transactionService.findMany(
      req.headers.authorization,
      params.balanceUuid,
    );
  }
}
