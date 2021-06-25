import { PrismaService } from '../db-client/prisma.service';
import { TransactionService } from '../transaction.service';
import { TransactionController } from '../transaction.controller';
import { TransactionModel } from '../transaction.model';
import {
  ClientProxy,
  ClientProxyFactory,
  RpcException,
} from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';

const fakeDate = new Date('01.02.2020');
const fakeReq: any = {
  headers: {
    authorization: 'jwt',
  },
};
const createTransactionData = (
  name = 'testname',
  amount = -300,
  boughtAt = fakeDate,
  balanceUuid = 'fakeUuid',
  categoryId = 3,
) => {
  return {
    name,
    amount,
    boughtAt,
    balanceUuid,
    categoryId,
  };
};

const createdTransactionData = (
  name = 'testname',
  amount = -300,
  boughtAt = fakeDate,
  balanceUuid = 'fakeUuid',
  categoryId = 3,
  createdAt = fakeDate,
  updatedAt = fakeDate,
  uuid = 'mocked',
  userUuid = 'mocked2',
  isDeleted = false,
) => {
  return {
    name,
    amount,
    boughtAt,
    balanceUuid,
    categoryId,
    createdAt,
    updatedAt,
    uuid,
    userUuid,
    isDeleted,
  };
};

describe('TransactionController', () => {
  let authClientProxy: ClientProxyFactory;
  let balanceClientProxy: ClientProxyFactory;
  let prismaService: PrismaService;
  let transactionService: TransactionService;
  let transactionModel: TransactionModel;
  let transactionController: TransactionController;

  beforeEach(() => {
    authClientProxy = new ClientProxyFactory();
    balanceClientProxy = new ClientProxyFactory();
    prismaService = new PrismaService();
    transactionModel = new TransactionModel(prismaService);
    transactionService = new TransactionService(
      transactionModel,
      authClientProxy as ClientProxy,
      balanceClientProxy as ClientProxy,
    );
    transactionController = new TransactionController(transactionService);
  });
  describe('Create Transaction', () => {
    it('should create transaction', async () => {
      const createdTransaction = createdTransactionData();
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockImplementation(async () => 'mocked2');
      jest
        .spyOn(transactionService, 'balanceForUserExists')
        .mockImplementation(async () => true);
      jest
        .spyOn(transactionModel, 'add')
        .mockImplementation(async () => createdTransaction);
      expect(
        await transactionController.create(createTransactionData(), fakeReq),
      ).toStrictEqual(createdTransaction);
    });
    it('should not create transaction when user not found', async () => {
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockRejectedValue(async () => new RpcException('User not found.'));
      try {
        await transactionController.create(createTransactionData(), fakeReq);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
    it('should not create transaction when balance not found', async () => {
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockImplementation(async () => 'mocked2');
      jest
        .spyOn(transactionService, 'balanceForUserExists')
        .mockRejectedValue(
          async () => new RpcException('Balance for user does not exist'),
        );
      try {
        await transactionController.create(createTransactionData(), fakeReq);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
  });
  describe('Update transaction', () => {
    it('should change amount value', async () => {
      const createdTransaction = createdTransactionData('newName');
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockImplementation(async () => 'mocked2');
      jest
        .spyOn(transactionService, 'balanceForUserExists')
        .mockImplementation(async () => true);
      jest
        .spyOn(transactionModel, 'update')
        .mockImplementation(async () => createdTransaction);
      expect(
        await transactionController.update(
          createTransactionData('newName'),
          fakeReq,
          { transactionUuid: 'mocked', balanceUuid: 'fakeUuid' },
        ),
      ).toStrictEqual(createdTransaction);
    });
    it('should not update transaction when user not found', async () => {
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockRejectedValue(async () => new RpcException('User not found.'));
      try {
        await transactionController.update(
          createTransactionData('newName'),
          fakeReq,
          { transactionUuid: 'mocked', balanceUuid: 'fakeUuid' },
        );
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
    it('should not update transaction when balance does not exist', async () => {
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockImplementation(async () => 'mocked2');
      jest
        .spyOn(transactionService, 'balanceForUserExists')
        .mockRejectedValue(
          async () => new RpcException('Balance for user does not exist'),
        );
      try {
        await transactionController.update(
          createTransactionData('newName'),
          fakeReq,
          { transactionUuid: 'mocked', balanceUuid: 'fakeUuid' },
        );
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
  });
  describe('Find many transactions by balance uuid', () => {
    it('should return list of transactions', async () => {
      const createdTransaction = createdTransactionData('newName');
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockImplementation(async () => 'mocked2');
      jest
        .spyOn(transactionService, 'balanceForUserExists')
        .mockImplementation(async () => true);
      jest
        .spyOn(transactionModel, 'findMany')
        .mockImplementation(async () => [createdTransaction]);
      expect(
        await transactionController.findMany(fakeReq, {
          balanceUuid: 'fakeUuid',
        }),
      ).toStrictEqual([createdTransaction]);
    });
    it('should not return list of transactions when user not found', async () => {
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockRejectedValue(async () => new RpcException('User not found.'));
      try {
        await transactionController.findMany(fakeReq, {
          balanceUuid: 'fakeUuid',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
    it('should not return list of transactions when balance not found', async () => {
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockImplementation(async () => 'mocked2');
      jest
        .spyOn(transactionService, 'balanceForUserExists')
        .mockRejectedValue(
          async () => new RpcException('Balance for user does not exist'),
        );
      try {
        await transactionController.findMany(fakeReq, {
          balanceUuid: 'fakeUuid',
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
    });
  });
  describe('Delete transaction', () => {
    it('should change isDeleted flag to true', async () => {
      const createdTransaction = createdTransactionData();
      createdTransaction.isDeleted = true;
      jest
        .spyOn(transactionService, 'getUserUuid')
        .mockImplementation(async () => 'mocked2');
      jest
        .spyOn(transactionService, 'balanceForUserExists')
        .mockImplementation(async () => true);
      jest
        .spyOn(transactionModel, 'update')
        .mockImplementation(async () => createdTransaction);
      expect(
        await transactionController.delete(fakeReq, {
          transactionUuid: 'mocked',
        }),
      ).toStrictEqual(createdTransaction);
    });
  });
});
