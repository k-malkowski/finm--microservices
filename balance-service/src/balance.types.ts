import { Length, IsPositive } from 'class-validator';

export class CreateBalanceDTO {
  @Length(2, 35)
  name!: string;

  @Length(2, 5)
  currency!: string;

  @IsPositive()
  value!: number;
}
