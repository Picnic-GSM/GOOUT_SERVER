import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/user/entites/student.entity";
import { StudentDataService } from "src/user/user.service";
import { Out } from "./entities/out.entity";
import { OutDataService } from "./out.service";
import { OutController } from "./out.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Out, Student])],
  providers: [OutDataService, StudentDataService],
  exports: [TypeOrmModule],
  controllers: [OutController],
})
export class OutModule {}
