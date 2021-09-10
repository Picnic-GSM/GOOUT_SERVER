import { Test, TestingModule } from "@nestjs/testing";
import { GoingController } from "./going.controller";

describe("GoingController", () => {
  let controller: GoingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoingController],
    }).compile();

    controller = module.get<GoingController>(GoingController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
