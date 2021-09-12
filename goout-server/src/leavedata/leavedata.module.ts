import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/student/userdata.entity";
import { StudentService } from "src/student/userdata.service";
import { Leave } from "./leavedata.entity";
import { LeavedataService } from "./leavedata.service";

@Module({
  imports: [TypeOrmModule.forFeature([Leave,Student])],
  providers: [LeavedataService,StudentService],
  exports: [TypeOrmModule],
})
export class LeavedataModule {}
