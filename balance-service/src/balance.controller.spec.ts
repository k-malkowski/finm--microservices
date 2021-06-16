import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './app.controller';
import { BalanceService } from './app.service';

describe('AppController', () => {
  let appController: BalanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    appController = app.get<BalanceController>(BalanceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
