import { Test, TestingModule } from '@nestjs/testing';
import { GlobalWowFlashcardsController } from './global-wow-flashcards.controller';

describe('GlobalWowFlashcardsController', () => {
  let controller: GlobalWowFlashcardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalWowFlashcardsController],
    }).compile();

    controller = module.get<GlobalWowFlashcardsController>(GlobalWowFlashcardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
