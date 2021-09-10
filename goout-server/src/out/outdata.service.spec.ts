import { Test, TestingModule } from "@nestjs/testing";
import { GoingoutDataService } from "./outdata.service";

describe("GoingoutdataService", () => {
  let service: GoingoutdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoingoutdataService],
    }).compile();

    service = module.get<GoingoutdataService>(GoingoutdataService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
