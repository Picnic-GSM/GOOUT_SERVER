import { Module } from "@nestjs/common";
import { StudentDataService, TeacherDataService } from "./user.service";
import { StudentController, TeacherController } from "./user.controller";

@Module({
  providers: [StudentDataService, TeacherDataService],
  controllers: [StudentController, TeacherController],
})
export class UserModule {}
