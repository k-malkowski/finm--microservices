import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  AuthValidateUser,
  CreatedUser,
  CreateUserDto,
  JwtLoginType,
  LoginUserDTO,
  User,
} from './auth.types';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { DEFAULT_TIMEOUT } from './types';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private client: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async register(userData: CreateUserDto): Promise<CreatedUser> {
    try {
      const user: User = await this.client
        .send({ cmd: 'create-user' }, userData)
        .pipe(timeout(DEFAULT_TIMEOUT))
        .toPromise();
      return {
        createdAt: user.createdAt,
        uuid: user.uuid,
        username: user.username,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<AuthValidateUser | null> {
    const user: User = await this.client
      .send({ cmd: 'find-user' }, { username })
      .pipe(timeout(DEFAULT_TIMEOUT))
      .toPromise();
    if (user && compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    user: LoginUserDTO & JwtLoginType,
  ): Promise<{ accessToken: string }> {
    const payload = { username: user.username, sub: user.uuid };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
