import { Test, TestingModule } from '@nestjs/testing';
import { StatementRequestsController } from './statement-requests.controller';

describe('StatementRequestsController', () => {
  let controller: StatementRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatementRequestsController],
    }).compile();

    controller = module.get<StatementRequestsController>(StatementRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
