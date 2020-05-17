import { Test, TestingModule } from '@nestjs/testing';

import { ListeningsService } from './listenings.service';

describe('ListeningsService', () => {
  let service: ListeningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListeningsService],
    }).compile();

    service = module.get<ListeningsService>(ListeningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
