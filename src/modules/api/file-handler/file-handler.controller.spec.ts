import { Test, TestingModule } from '@nestjs/testing';
import { FileHandlerController } from './file-handler.controller';

describe('FileHandlerController', () => {
  let controller: FileHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileHandlerController],
    }).compile();

    controller = module.get<FileHandlerController>(FileHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
