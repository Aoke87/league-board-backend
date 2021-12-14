import { Test, TestingModule } from '@nestjs/testing';
import { MatchV5Service } from './match-v5.service';

describe('MatchV5Service', () => {
  let service: MatchV5Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchV5Service],
    }).compile();

    service = module.get<MatchV5Service>(MatchV5Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
