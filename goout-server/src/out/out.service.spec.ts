import { Test, TestingModule } from "@nestjs/testing";
import { OutDataService, OutDataService } from "./out.service";

describe("GoingoutdataService", () => {
  let service: GoingoutdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutDataService],
    }).compile();

    service = module.get<GoingoutdataService>(OutDataService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
