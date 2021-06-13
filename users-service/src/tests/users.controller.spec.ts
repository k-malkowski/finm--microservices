import { UsersModel } from '../users.model';
import { UsersService } from '../users.service';
import { PrismaService } from '../db-client/prisma.service';
import { UsersController } from '../users.controller';
import { createdUserData, createUserData } from './helpers';

describe('UsersController', () => {
  let prismaService: PrismaService;
  let usersService: UsersService;
  let usersModel: UsersModel;
  let usersController: UsersController;

  beforeEach(() => {
    prismaService = new PrismaService();
    usersModel = new UsersModel(prismaService);
    usersService = new UsersService(usersModel);
    usersController = new UsersController(usersService);
  });

  describe('create user', () => {
    it('should return created user', async () => {
      const user = createdUserData();
      jest
        .spyOn(usersService, 'usernameExists')
        .mockImplementation(async () => false);
      jest
        .spyOn(usersService, 'emailExists')
        .mockImplementation(async () => false);
      jest.spyOn(usersModel, 'add').mockImplementation(async () => user);
      expect(await usersController.createUser(createUserData())).toStrictEqual(
        user,
      );
    });
    it('should return 409 when username already exists', async () => {
      jest
        .spyOn(usersService, 'usernameExists')
        .mockImplementation(async () => true);
      jest
        .spyOn(usersService, 'emailExists')
        .mockImplementation(async () => false);
      try {
        await usersController.createUser(createUserData());
        expect(true).toBe(false);
      } catch ({ error }) {
        expect(error.status).toBe(409);
      }
    });
    it('should return 409 when email already exists', async () => {
      jest
        .spyOn(usersService, 'usernameExists')
        .mockImplementation(async () => false);
      jest
        .spyOn(usersService, 'emailExists')
        .mockImplementation(async () => true);
      try {
        await usersService.createUser(createUserData());
        expect(true).toBe(false);
      } catch ({ error }) {
        expect(error.status).toBe(409);
      }
    });
  });
  describe('find user', () => {
    it('should return user', async () => {
      const user = createdUserData();
      jest.spyOn(usersModel, 'findBy').mockImplementation(async () => user);
      expect(
        await usersController.findUser({ username: 'johndoe' }),
      ).toStrictEqual(user);
    });
    it('should return null when user is not found', async () => {
      jest.spyOn(usersModel, 'findBy').mockImplementation(async () => null);
      expect(
        await usersController.findUser({ username: 'johndoe' }),
      ).toStrictEqual(null);
    });
    it('should throw RPC Exception when db returns error', async () => {
      jest
        .spyOn(usersModel, 'findBy')
        .mockRejectedValue(() => new Error('Database is not responding'));
      try {
        await usersController.findUser({ username: 'johndoe' });
        expect(true).toBe(false);
      } catch ({ message }) {
        expect(message).toBe('Rpc Exception');
      }
    });
  });
});
