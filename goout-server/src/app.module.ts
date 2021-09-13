import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

// Module
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { LeaveModule } from "./leave/leave.module";
import { OutModule } from "./out/out.module";

// Controller
import { LeaveController } from "./leave/leave.controller";
import { OutController } from "./out/out.controller";
import {
  UserController,
  StudentController,
  TeacherController,
} from "./user/user.controller";

// Entity
import { Leave } from "./leave/entites/leave.entity";
import { Out } from "./out/entities/out.entity";
import { Teacher } from "./user/entites/teacher.entity";
import { Student } from "./user/entites/student.entity";

// Service
import { RedisService } from "./util/redis";
import { LeaveDataService } from "./leave/leave.service";
import { OutDataService } from "./out/out.service";
import { StudentDataService, TeacherDataService } from "./user/user.service";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: +process.env.PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Student, Leave, Out, Teacher],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    LeaveModule,
    OutModule,
  ],
  controllers: [
    AppController,
    OutController,
    LeaveController,
    UserController,
    StudentController,
    TeacherController,
  ],
  providers: [
    LeaveDataService,
    OutDataService,
    StudentDataService,
    TeacherDataService,
  ],
})
export class AppModule {}
