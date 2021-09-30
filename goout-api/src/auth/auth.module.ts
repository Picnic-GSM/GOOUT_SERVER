import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/user/entites/student.entity";
import { Teacher } from "src/user/entites/teacher.entity";
import { StudentDataService, TeacherDataService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: "30m" },
    }),
    TypeOrmModule.forFeature([Student, Teacher]),
  ],
  providers: [AuthService, StudentDataService, TeacherDataService],
  exports: [AuthService],
})
export class AuthModule {}
