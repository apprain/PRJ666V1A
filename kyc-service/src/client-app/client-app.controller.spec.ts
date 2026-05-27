import { Test, TestingModule } from '@nestjs/testing';
import { ClientAppController } from './client-app.controller';

describe('ClientAppController', () => {
  let controller: ClientAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAppController],
    }).compile();

    controller = module.get<ClientAppController>(ClientAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
