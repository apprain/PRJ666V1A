import { Test, TestingModule } from '@nestjs/testing';
import { KycSessionController } from './kyc-session.controller';

describe('KycSessionController', () => {
  let controller: KycSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KycSessionController],
    }).compile();

    controller = module.get<KycSessionController>(KycSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
