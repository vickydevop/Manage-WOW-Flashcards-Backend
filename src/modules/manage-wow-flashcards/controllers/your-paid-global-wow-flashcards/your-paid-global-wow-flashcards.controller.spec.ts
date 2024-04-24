import { Test, TestingModule } from '@nestjs/testing';
import { YourPaidGlobalWowFlashcardsController } from './your-paid-global-wow-flashcards.controller';

describe('YourPaidGlobalWowFlashcardsController', () => {
  let controller: YourPaidGlobalWowFlashcardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YourPaidGlobalWowFlashcardsController],
    }).compile();

    controller = module.get<YourPaidGlobalWowFlashcardsController>(YourPaidGlobalWowFlashcardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
