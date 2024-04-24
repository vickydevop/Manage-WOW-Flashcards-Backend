import { Test, TestingModule } from '@nestjs/testing';
import { YourPaidGlobalWowFlashcardsService } from './your-paid-global-wow-flashcards.service';

describe('YourPaidGlobalWowFlashcardsService', () => {
  let service: YourPaidGlobalWowFlashcardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourPaidGlobalWowFlashcardsService],
    }).compile();

    service = module.get<YourPaidGlobalWowFlashcardsService>(YourPaidGlobalWowFlashcardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
