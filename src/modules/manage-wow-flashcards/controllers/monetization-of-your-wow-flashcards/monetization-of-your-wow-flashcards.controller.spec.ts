import { Test, TestingModule } from '@nestjs/testing';
import { MonetizationOfYourWowFlashcardsController } from './monetization-of-your-wow-flashcards.controller';

describe('MonetizationOfYourWowFlashcardsController', () => {
  let controller: MonetizationOfYourWowFlashcardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonetizationOfYourWowFlashcardsController],
    }).compile();

    controller = module.get<MonetizationOfYourWowFlashcardsController>(MonetizationOfYourWowFlashcardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
