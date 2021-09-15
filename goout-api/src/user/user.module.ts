import { CacheModule, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import {
  StudentController,
  TeacherController,
  UserController,
} from "./user.controller";
import { studentProviders, teacherProviders } from "./user.providers";
import { StudentDataService, TeacherDataService, UserService } from "./user.service";
import { RedisService } from "src/util/redis";
import { SendEmail } from "src/util/mail";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Student, Teacher]),
    AuthModule,
    CacheModule.register(),
    ConfigModule.forRoot()
  ],
  providers: [
    ...studentProviders,
    ...teacherProviders,
    StudentDataService,
    TeacherDataService,
    RedisService,
    UserService,
  ],
  controllers: [UserController, StudentController, TeacherController],
})
export class UserModule {}
