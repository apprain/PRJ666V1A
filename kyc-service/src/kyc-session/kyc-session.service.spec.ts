import { Test, TestingModule } from '@nestjs/testing';
import { KycSessionService } from './kyc-session.service';

describe('KycSessionService', () => {
  let service: KycSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KycSessionService],
    }).compile();

    service = module.get<KycSessionService>(KycSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
