import { Test, TestingModule } from '@nestjs/testing';
import { AwsRekognitionService } from './aws-rekognition.service';

describe('AwsRekognitionService', () => {
  let service: AwsRekognitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsRekognitionService],
    }).compile();

    service = module.get<AwsRekognitionService>(AwsRekognitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
