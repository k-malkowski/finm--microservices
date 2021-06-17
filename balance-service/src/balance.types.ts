import { Length, IsPositive, IsOptional } from 'class-validator';

export class CreateBalanceDTO {
  @Length(2, 35)
  name!: string;

  @Length(2, 5)
  currency!: string;

  @IsPositive()
  value!: number;
}

export class UpdateBalanceDTO {
  @IsOptional()
  @Length(2, 35)
  name?: string;

  @IsOptional()
  @Length(2, 5)
  currency?: string;

  @IsOptional()
  @IsPositive()
  value?: number;
}

