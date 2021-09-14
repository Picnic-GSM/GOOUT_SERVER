import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoginController } from "./login/login.controller";
import { LoginService } from "./login/login.service";
import { LoginModule } from "./login/login.module";
import { Student } from "./student/userdata.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { StudentService } from "./student/userdata.service";
import { UserdataModule } from "./student/userdata.module";
import { AuthModule } from "./auth/auth.module";
import { LeavedataModule } from "./leavedata/leavedata.module";
import { LeaveController } from "./leave/leave.controller";
import { LeaveModule } from "./leave/leave.module";
import { RegisterController } from "./register/register.controller";
import { RegisterModule } from "./register/register.module";
import { Leave } from "./leavedata/leavedata.entity";
import { LeavedataService } from "./leavedata/leavedata.service";
import { GoingoutdataModule } from "./out/outdata.module";
import { Out } from "./out/outdata.entity";
import { GoingController } from "./going/going.controller";
import { GoingModule } from "./going/going.module";
import { GoingoutDataService } from "./out/outdata.service";
import { GoingService } from "./going/going.service";
import { RedisModule } from "@nestjs-modules/ioredis";
import { RegisterService } from "./register/register.service";
import { RedisService } from "./util/redis.service";
import { authnumService } from "./util/authnum.service";
import { TeacherdataService } from "./teacher/teacher.service";
import { Teacher } from "./teacher/teacher.entity";
import { TeacherdataModule } from "./teacher/teacher.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Student, Leave, Out, Teacher],
      synchronize: true,
    }),
    RedisModule.forRoot({
      config: { 
        url: process.env.REDIS_URL,
      },
    }),
    
    LoginModule,
    UserdataModule,
    AuthModule,
    LeavedataModule,
    LeaveModule,
    RegisterModule,
    GoingoutdataModule,
    GoingModule,
    TeacherdataModule,
  ],
  controllers: [
    AppController,
    LoginController,
    LeaveController,
    RegisterController,
    GoingController,
  ],
  providers: [
    AppService,
    LoginService,
    StudentService,
      LeavedataService,
    GoingoutDataService,
    GoingService,
    TeacherdataService,
    RegisterService,
    RedisService,
    authnumService
  ],
})
export class AppModule {}
