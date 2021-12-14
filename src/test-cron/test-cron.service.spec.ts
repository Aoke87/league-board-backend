import { Test, TestingModule } from '@nestjs/testing';
import { TestCronService } from './test-cron.service';

describe('TestCronService', () => {
  let service: TestCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestCronService],
    }).compile();

    service = module.get<TestCronService>(TestCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
