import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto, JwtLoginType, LoginUserDTO } from './auth.types';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ping')
  async ping() {
    return {
      message: 'pong',
    };
  }

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    return this.authService.register(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: LoginUserDTO & JwtLoginType }) {
    return this.authService.login(req.user);
  }
}
