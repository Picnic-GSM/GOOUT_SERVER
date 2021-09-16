import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import {
  InputValidator,
  LoginController,
  StudentController,
  TeacherController,
} from "./user.controller";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { studentProviders, teacherProviders } from "./user.providers";
import { StudentDataService, TeacherDataService } from "./user.service";
import { MailHandler } from "src/util/mailHandler";

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
    MailHandler,
    InputValidator,
  ],
  controllers: [LoginController, StudentController, TeacherController],
})
export class UserModule {}
