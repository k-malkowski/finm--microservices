import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { of } from 'rxjs';

const date = new Date('01.01.2020');

const user = {
  uuid: 'test',
  username: 'user',
  createdAt: date,
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
      jest.spyOn(clientProxy, 'send').mockImplementation(() => of(user));
      expect(
        await authController.register({
          username: 'test',
          password: 'mocked',
          email: 'john@doe.com',
          firstName: 'mocked',
          lastName: 'mocked',
        }),
      );
    });
  });
});
