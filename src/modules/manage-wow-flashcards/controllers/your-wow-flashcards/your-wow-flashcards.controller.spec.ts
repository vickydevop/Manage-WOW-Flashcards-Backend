import { Test, TestingModule } from '@nestjs/testing';
import { YourWowFlashcardsController } from './your-wow-flashcards.controller';

describe('YourWowFlashcardsController', () => {
  let controller: YourWowFlashcardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YourWowFlashcardsController],
    }).compile();

    controller = module.get<YourWowFlashcardsController>(YourWowFlashcardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
