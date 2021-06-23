import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyFactory } from '@nestjs/microservices';
import { of } from 'rxjs';
import { ConflictException } from '@nestjs/common';

const date = new Date('01.01.2020');

const createdUserData = (
  uuid = 'test',
  username = 'user',
  createdAt = date,
) => {
  return {
    uuid,
    username,
    createdAt,
  };
};

const createUserData = (
  username = 'test',
  password = 'mocked',
  email = 'john@doe.com',
  firstName = 'mocked',
  lastName = 'mocked',
) => {
  return {
    username,
    password,
    email,
    firstName,
    lastName,
  };
};

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;
  let clientProxy;
  beforeEach(() => {
    clientProxy = ClientProxyFactory.create({});
    // @ts-ignore
    authService = new AuthService(clientProxy, JwtService);
    authController = new AuthController(authService);
  });
  describe('register', () => {
    it('should register user and return user uuid', async () => {
      jest
        .spyOn(clientProxy, 'send')
        .mockImplementation(() => of(createdUserData()));
      expect(await authController.register(createUserData())).toStrictEqual(
        createdUserData(),
      );
    });
  });
});
