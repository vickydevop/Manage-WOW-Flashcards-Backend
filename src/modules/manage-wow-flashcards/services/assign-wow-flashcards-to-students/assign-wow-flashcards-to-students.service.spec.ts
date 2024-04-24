import { Test, TestingModule } from '@nestjs/testing';
import { AssignWowFlashcardsToStudentsService } from './assign-wow-flashcards-to-students.service';

describe('AssignWowFlashcardsToStudentsService', () => {
  let service: AssignWowFlashcardsToStudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignWowFlashcardsToStudentsService],
    }).compile();

    service = module.get<AssignWowFlashcardsToStudentsService>(AssignWowFlashcardsToStudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
