import { Test, TestingModule } from '@nestjs/testing';
import { CurrentGameService } from './current-game.service';

describe('CurrentGameService', () => {
  let service: CurrentGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentGameService],
    }).compile();

    service = module.get<CurrentGameService>(CurrentGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
