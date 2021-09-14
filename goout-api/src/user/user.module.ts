import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import {
  LoginController,
  StudentController,
  TeacherController,
} from "./user.controller";
import { studentProviders, teacherProviders } from "./user.providers";
import { StudentDataService, TeacherDataService } from "./user.service";

@Module({
  imports: [DatabaseModule],
  providers: [
    ...studentProviders,
    ...teacherProviders,
    StudentDataService,
    TeacherDataService,
  ],
  controllers: [LoginController, StudentController, TeacherController],
})
export class UserModule {}
