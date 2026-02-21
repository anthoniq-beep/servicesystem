import { Test, TestingModule } from '@nestjs/testing';
import { SalesTargetService } from './sales-target.service';

describe('SalesTargetService', () => {
  let service: SalesTargetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesTargetService],
    }).compile();

    service = module.get<SalesTargetService>(SalesTargetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
