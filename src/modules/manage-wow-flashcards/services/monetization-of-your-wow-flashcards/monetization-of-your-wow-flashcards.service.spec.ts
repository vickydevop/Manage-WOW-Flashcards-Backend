import { Test, TestingModule } from '@nestjs/testing';
import { MonetizationOfYourWowFlashcardsService } from './monetization-of-your-wow-flashcards.service';

describe('MonetizationOfYourWowFlashcardsService', () => {
  let service: MonetizationOfYourWowFlashcardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonetizationOfYourWowFlashcardsService],
    }).compile();

    service = module.get<MonetizationOfYourWowFlashcardsService>(MonetizationOfYourWowFlashcardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
