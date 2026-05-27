import { Test, TestingModule } from '@nestjs/testing';
import { ClientAdminService } from './client-admin.service';

describe('ClientAdminService', () => {
  let service: ClientAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientAdminService],
    }).compile();

    service = module.get<ClientAdminService>(ClientAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
