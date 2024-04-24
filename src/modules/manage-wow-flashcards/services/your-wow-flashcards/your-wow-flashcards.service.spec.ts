import { Test, TestingModule } from '@nestjs/testing';
import { YourWowFlashcardsService } from './your-wow-flashcards.service';

describe('YourWowFlashcardsService', () => {
  let service: YourWowFlashcardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourWowFlashcardsService],
    }).compile();

    service = module.get<YourWowFlashcardsService>(YourWowFlashcardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
