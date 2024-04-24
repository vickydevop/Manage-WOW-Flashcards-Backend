import { Test, TestingModule } from '@nestjs/testing';
import { RecommendedWowFlashcardsFromOtherTeachingFacultyController } from './recommended-wow-flashcards-from-other-teaching-faculty.controller';

describe('RecommendedWowFlashcardsFromOtherTeachingFacultyController', () => {
  let controller: RecommendedWowFlashcardsFromOtherTeachingFacultyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendedWowFlashcardsFromOtherTeachingFacultyController],
    }).compile();

    controller = module.get<RecommendedWowFlashcardsFromOtherTeachingFacultyController>(RecommendedWowFlashcardsFromOtherTeachingFacultyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
