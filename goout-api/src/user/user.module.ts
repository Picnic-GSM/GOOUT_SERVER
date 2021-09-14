import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import {
  LoginController,
  StudentController,
  TeacherController,
} from "./user.controller";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { studentProviders, teacherProviders } from "./user.providers";
import { StudentDataService, TeacherDataService } from "./user.service";

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Student, Teacher]),
    AuthModule,
  ],
  providers: [
    ...studentProviders,
    ...teacherProviders,
    StudentDataService,
    TeacherDataService,
  ],
  controllers: [LoginController, StudentController, TeacherController],
})
export class UserModule {}
