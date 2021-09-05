import { Test, TestingModule } from '@nestjs/testing';
import { GoingoutdataService } from './goingoutdata.service';

describe('GoingoutdataService', () => {
  let service: GoingoutdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoingoutdataService],
    }).compile();

    service = module.get<GoingoutdataService>(GoingoutdataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
