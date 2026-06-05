import { Test, TestingModule } from '@nestjs/testing';
import { AwsTextractService } from './aws-textract.service';

describe('AwsTextractService', () => {
  let service: AwsTextractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsTextractService],
    }).compile();

    service = module.get<AwsTextractService>(AwsTextractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
