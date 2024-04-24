import { Test, TestingModule } from '@nestjs/testing';
import { GlobalWowFlashcardsService } from './global-wow-flashcards.service';

describe('GlobalWowFlashcardsService', () => {
  let service: GlobalWowFlashcardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalWowFlashcardsService],
    }).compile();

    service = module.get<GlobalWowFlashcardsService>(GlobalWowFlashcardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
