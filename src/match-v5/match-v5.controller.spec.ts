import { Test, TestingModule } from '@nestjs/testing';
import { MatchV5Controller } from './match-v5.controller';

describe('MatchV5Controller', () => {
  let controller: MatchV5Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchV5Controller],
    }).compile();

    controller = module.get<MatchV5Controller>(MatchV5Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
