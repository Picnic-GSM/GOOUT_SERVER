import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { LeaveController } from "./leave.controller";
import { leaveProviders } from "./leave.providers";
import { LeaveDataService } from "./leave.service";

@Module({
  imports: [DatabaseModule],
  providers: [...leaveProviders, LeaveDataService],
  controllers: [LeaveController],
})
export class LeaveModule {}
