import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoingService } from "src/going/going.service";
import { Student } from "src/student/userdata.entity";
import { StudentService } from "src/student/userdata.service";
import { Out } from "./outdata.entity";
import { GoingoutDataService } from "./outdata.service";

@Module({
  imports: [TypeOrmModule.forFeature([Out,Student])],
  providers: [GoingoutDataService, GoingService,StudentService],
  exports: [TypeOrmModule],
})
export class GoingoutdataModule {}
