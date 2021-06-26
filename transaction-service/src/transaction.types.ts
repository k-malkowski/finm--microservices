import {
  Length,
  IsPositive,
  IsInt,
  IsDateString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDTO {
  @Length(2, 55)
  name!: string;

  @IsInt()
  amount!: number;

  @IsDateString()
  transactionMadeAt!: Date;

  @IsUUID('4')
  balanceUuid!: string;

  @IsInt()
  @IsPositive()
  categoryId!: number;
}

export class UpdateTransactionDTO {
  @IsOptional()
  @Length(2, 55)
  name?: string;

  @IsInt()
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  transactionMadeAt?: Date;

  @IsInt()
  @IsOptional()
  @IsPositive()
  categoryId?: number;
}

export class FindManyQueryDTO {
  @IsDateString()
  @IsOptional()
  dateFrom?: Date;

  @IsDateString()
  @IsOptional()
  dateTo?: Date;
}
