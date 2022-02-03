import { Test, TestingModule } from '@nestjs/testing';
import { CurrentGameController } from './current-game.controller';

describe('CurrentGameController', () => {
  let controller: CurrentGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentGameController],
    }).compile();

    controller = module.get<CurrentGameController>(CurrentGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
