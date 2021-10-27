import { Test, TestingModule } from '@nestjs/testing';
import { OutDataService } from './out.service';

describe('OutDataService', () => {
    let service: OutDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OutDataService],
        }).compile();

        service = module.get<OutDataService>(OutDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
