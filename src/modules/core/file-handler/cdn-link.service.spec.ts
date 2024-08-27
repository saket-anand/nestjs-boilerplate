import { Test, TestingModule } from '@nestjs/testing';
import { CdnLinkService } from './cdn-link.service';

describe('CdnLinkServiceService', () => {
  let service: CdnLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdnLinkService],
    }).compile();

    service = module.get<CdnLinkService>(CdnLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
