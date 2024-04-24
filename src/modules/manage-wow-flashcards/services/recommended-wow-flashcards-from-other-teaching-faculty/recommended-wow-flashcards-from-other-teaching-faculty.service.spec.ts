import { Test, TestingModule } from '@nestjs/testing';
import { RecommendedWowFlashcardsFromOtherTeachingFacultyService } from './recommended-wow-flashcards-from-other-teaching-faculty.service';

describe('RecommendedWowFlashcardsFromOtherTeachingFacultyService', () => {
  let service: RecommendedWowFlashcardsFromOtherTeachingFacultyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommendedWowFlashcardsFromOtherTeachingFacultyService],
    }).compile();

    service = module.get<RecommendedWowFlashcardsFromOtherTeachingFacultyService>(RecommendedWowFlashcardsFromOtherTeachingFacultyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
