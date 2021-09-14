import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/user/entites/student.entity";
import { Teacher } from "src/user/entites/teacher.entity";
import { StudentDataService, TeacherDataService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "30m" },
    }),
    TypeOrmModule.forFeature([Student,Teacher])
  ],
  providers: [AuthService,StudentDataService,TeacherDataService],
  exports: [AuthService],
})
export class AuthModule {}
