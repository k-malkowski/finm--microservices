import { IsEmail, Length, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface AuthValidateUser {
  uuid: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtLoginType {
  uuid: string;
}

export class LoginUserDTO {
  @ValidateNested({ each: true })
  @ApiProperty({
    default: 'johndoe',
  })
  @Length(4, 24)
  username!: string;

  @ApiProperty({
    default: 'Qwedcxzas!23',
  })
  @Length(8, 32)
  password!: string;
}

export class CreateUserDto {
  @ApiProperty({
    default: 'johndoe',
  })
  @Length(2, 30)
  username!: string;

  @ApiProperty({
    default: 'Qwedcxzas!23',
  })
  @Length(8, 55)
  password!: string;

  @ApiProperty({
    default: 'john@doe.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    default: 'John',
  })
  @Length(3, 55)
  firstName!: string;

  @ApiProperty({
    default: 'Doe',
  })
  @Length(3, 55)
  lastName!: string;
}

export interface CreatedUser {
  username: string;
  createdAt: Date;
  uuid: string;
}
