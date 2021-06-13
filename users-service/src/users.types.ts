import { IsEmail, Length, ValidateNested } from 'class-validator';

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
  @Length(4, 24)
  username!: string;

  @Length(8, 32)
  password!: string;
}

export class CreateUserDto {
  @Length(2, 30)
  username!: string;

  @Length(8, 55)
  password!: string;

  @IsEmail()
  email!: string;

  @Length(3, 55)
  firstName!: string;

  @Length(3, 55)
  lastName!: string;
}

export interface CreatedUser {
  username: string;
  createdAt: Date;
  uuid: string;
}
