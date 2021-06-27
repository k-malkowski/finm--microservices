import {
  Length,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateCategoryDTO {
  @Length(2, 55)
  name!: string;

  @IsUUID('4')
  userUuid!: string;
}

export class UpdateCategoryDTO {
  @IsOptional()
  @Length(2, 55)
  name?: string;
}
