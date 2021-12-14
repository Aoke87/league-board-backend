import { Test, TestingModule } from '@nestjs/testing';
import { RiotClientService } from './riot-client.service';

describe('RiotClientService', () => {
  let service: RiotClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiotClientService],
    }).compile();

    service = module.get<RiotClientService>(RiotClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
