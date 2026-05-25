import { Test, TestingModule } from '@nestjs/testing';
import { StatementSharesService } from './statement-shares.service';

describe('StatementSharesService', () => {
  let service: StatementSharesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatementSharesService],
    }).compile();

    service = module.get<StatementSharesService>(StatementSharesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
