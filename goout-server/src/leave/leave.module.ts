import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Leave } from "src/leave/entites/leave.entity";
import { LeaveController } from "./leave.controller";
import { LeaveDataService } from "./leave.service";

@Module({
  providers: [LeaveDataService],
  controllers: [LeaveController],
})
export class LeaveModule {}
