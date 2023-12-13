import { Test, TestingModule } from '@nestjs/testing';
import { FunkosControllerController } from './funkos-controller.controller';

describe('FunkosControllerController', () => {
  let controller: FunkosControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunkosControllerController],
    }).compile();

    controller = module.get<FunkosControllerController>(FunkosControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
