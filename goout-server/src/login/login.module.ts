import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Teacher } from "src/teacher/teacher.entity";
import { TeacherdataService } from "src/teacher/teacher.service";
import { Student } from "src/student/userdata.entity";
import { StudentService } from "src/student/userdata.service";

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student])],
  providers: [StudentService, TeacherdataService],
})
export class LoginModule {}
