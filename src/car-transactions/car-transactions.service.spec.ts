import { Test, TestingModule } from '@nestjs/testing';
import { CarTransactionsService } from './car-transactions.service';

describe('CarTransactionsService', () => {
  let service: CarTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarTransactionsService],
    }).compile();

    service = module.get<CarTransactionsService>(CarTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
