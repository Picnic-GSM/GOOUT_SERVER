import { Test, TestingModule } from '@nestjs/testing';
import { OutController } from './out.controller';

describe('OutController', () => {
    let controller: OutController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OutController],
        }).compile();

        controller = module.get<OutController>(OutController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
