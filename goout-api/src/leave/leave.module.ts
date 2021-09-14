import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database/database.module";
import { Student } from "src/user/entites/student.entity";
import { StudentDataService } from "src/user/user.service";
import { Leave } from "./entites/leave.entity";
import { LeaveController } from "./leave.controller";
import { leaveProviders } from "./leave.providers";
import { LeaveDataService } from "./leave.service";

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Leave,Student])],
  providers: [...leaveProviders, LeaveDataService,StudentDataService],
  controllers: [LeaveController],
})
export class LeaveModule {}
