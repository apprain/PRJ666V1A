import { Test, TestingModule } from '@nestjs/testing';
import { ClientAdminController } from './client-admin.controller';

describe('ClientAdminController', () => {
  let controller: ClientAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAdminController],
    }).compile();

    controller = module.get<ClientAdminController>(ClientAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
