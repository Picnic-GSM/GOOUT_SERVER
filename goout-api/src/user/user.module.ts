import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { DatabaseModule } from "src/database/database.module";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { UserController } from "./user.controller";
import { studentProviders, teacherProviders } from "./user.providers";
import { StudentDataService, TeacherDataService } from "./user.service";

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Student,Teacher])],
  providers: [
    ...studentProviders,
    ...teacherProviders,
    StudentDataService,
    TeacherDataService,
    AuthService
  ],
  controllers: [UserController],
})
export class UserModule {}
