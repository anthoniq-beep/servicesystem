import { Test, TestingModule } from '@nestjs/testing';
import { SalesTargetResolver } from './sales-target.resolver';

describe('SalesTargetResolver', () => {
  let resolver: SalesTargetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesTargetResolver],
    }).compile();

    resolver = module.get<SalesTargetResolver>(SalesTargetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
