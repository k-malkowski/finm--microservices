import { Length, IsPositive, IsNumber, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class CreateTransactionDTO {
  @Length(2, 55)
  name!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  forDate!: Date;

  @IsUUID('4')
  balanceUuid!: string;

  @IsNumber()
  @IsPositive()
  categoryId!: number;
}

export class UpdateTransactionDTO {
  @IsOptional()
  @Length(2, 55)
  name?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  forDate?: Date;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  categoryId?: number;
}
