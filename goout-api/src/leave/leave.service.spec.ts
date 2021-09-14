import { Test, TestingModule } from "@nestjs/testing";
import { LeaveDataService } from "./leave.service";

describe("LeaveDataService", () => {
  let service: LeaveDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveDataService],
    }).compile();

    service = module.get<LeaveDataService>(LeaveDataService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
