import { Test, TestingModule } from '@nestjs/testing';
import { OtpGenerationService } from './otp-generation.service';

describe('OtpGenerationService', () => {
  let service: OtpGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpGenerationService],
    }).compile();

    service = module.get<OtpGenerationService>(OtpGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
