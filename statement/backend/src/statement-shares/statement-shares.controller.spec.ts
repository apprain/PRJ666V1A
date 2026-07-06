import { Test, TestingModule } from '@nestjs/testing';
import { StatementSharesController } from './statement-shares.controller';

describe('StatementSharesController', () => {
  let controller: StatementSharesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatementSharesController],
    }).compile();

    controller = module.get<StatementSharesController>(StatementSharesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
