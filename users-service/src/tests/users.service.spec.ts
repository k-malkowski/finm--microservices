import { UsersModel } from '../users.model';
import { UsersService } from '../users.service';
import { PrismaService } from '../db-client/prisma.service';
import { createdUserData } from './helpers';

describe('UsersService', () => {
  let prismaService: PrismaService;
  let usersService: UsersService;
  let usersModel: UsersModel;

  beforeEach(() => {
    prismaService = new PrismaService();
    usersModel = new UsersModel(prismaService);
    usersService = new UsersService(usersModel);
  });

  describe('username exists', () => {
    it('should return true when username exists', async () => {
      const user = createdUserData();
      jest.spyOn(usersModel, 'findBy').mockImplementation(async () => user);
      expect(await usersService.usernameExists('johndoe')).toBeTruthy();
    });
    it('should return false when username is not exist', async () => {
      jest.spyOn(usersModel, 'findBy').mockImplementation(async () => null);
      expect(await usersService.usernameExists('johndoe')).toBeFalsy();
    });
    it('should return RPC Exception when database is not responding', async () => {
      jest
        .spyOn(usersModel, 'findBy')
        .mockRejectedValue(() => new Error('Database is not responding'));
      try {
        await usersService.usernameExists('johndoe');
        expect(true).toBe(false);
      } catch ({ message }) {
        expect(message).toBe('Rpc Exception');
      }
    });
  });
  describe('email exists', () => {
    it('should return true when email exists', async () => {
      const user = createdUserData();
      jest.spyOn(usersModel, 'findBy').mockImplementation(async () => user);
      expect(await usersService.emailExists('john@doe.com')).toBeTruthy();
    });
    it('should return false when username is not exist', async () => {
      jest.spyOn(usersModel, 'findBy').mockImplementation(async () => null);
      expect(await usersService.emailExists('john@doe.com')).toBeFalsy();
    });
    it('should return RPC Exception when database is not responding', async () => {
      jest
        .spyOn(usersModel, 'findBy')
        .mockRejectedValue(() => new Error('Database is not responding'));
      try {
        await usersService.emailExists('john@doe.com');
        expect(true).toBe(false);
      } catch ({ message }) {
        expect(message).toBe('Rpc Exception');
      }
    });
  });
});
