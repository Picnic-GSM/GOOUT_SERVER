import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UserController } from "./user.controller";
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
  controllers: [UserController],
})
export class UserModule {}
