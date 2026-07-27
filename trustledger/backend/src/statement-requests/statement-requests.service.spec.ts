import { Test, TestingModule } from '@nestjs/testing';
import { StatementRequestsService } from './statement-requests.service';

describe('StatementRequestsService', () => {
  let service: StatementRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatementRequestsService],
    }).compile();

    service = module.get<StatementRequestsService>(StatementRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
