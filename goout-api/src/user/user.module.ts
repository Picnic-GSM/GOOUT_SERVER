import { CacheModule, Module } from "@nestjs/common";
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
import { RedisService } from "src/util/redis";
import { SendEmail } from "src/util/mail";

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Student,Teacher]),AuthModule,CacheModule.register(),],
  providers: [
    ...studentProviders,
    ...teacherProviders,
    StudentDataService,
    TeacherDataService,
    RedisService,
    SendEmail
  ],
  controllers: [UserController,StudentController,TeacherController],
})
export class UserModule {}
