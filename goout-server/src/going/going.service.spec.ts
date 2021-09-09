import { Test, TestingModule } from "@nestjs/testing";
import { GoingService } from "./going.service";

describe("GoingService", () => {
  let service: GoingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoingService],
    }).compile();

    service = module.get<GoingService>(GoingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
