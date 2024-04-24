import { Test, TestingModule } from '@nestjs/testing';
import { AssignWowFlashcardsToStudentsController } from './assign-wow-flashcards-to-students.controller';

describe('AssignWowFlashcardsToStudentsController', () => {
  let controller: AssignWowFlashcardsToStudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignWowFlashcardsToStudentsController],
    }).compile();

    controller = module.get<AssignWowFlashcardsToStudentsController>(AssignWowFlashcardsToStudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
