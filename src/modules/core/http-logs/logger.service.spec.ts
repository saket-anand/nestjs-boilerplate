import { Test, TestingModule } from '@nestjs/testing';
import { HttpLoggerService } from './http-logger.service';

describe('LoggerService', () => {
  let service: HttpLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpLoggerService],
    }).compile();

    service = module.get<HttpLoggerService>(HttpLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
