import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Leave } from "src/leavedata/leavedata.entity";
import { LeavedataService } from "src/leavedata/leavedata.service";
import { LeaveService } from "./leave.service";

@Module({
  providers: [LeaveService],
})
export class LeaveModule {}
