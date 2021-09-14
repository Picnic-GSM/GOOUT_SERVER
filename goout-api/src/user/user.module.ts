import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { StudentController, TeacherController, UserController } from "./user.controller";
import { studentProviders, teacherProviders } from "./user.providers";
import { StudentDataService, TeacherDataService } from "./user.service";

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Student,Teacher]),AuthModule],
  providers: [
    ...studentProviders,
    ...teacherProviders,
    StudentDataService,
    TeacherDataService,
  ],
  controllers: [UserController,StudentController,TeacherController],
})
export class UserModule {}
