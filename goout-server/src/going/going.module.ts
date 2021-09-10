import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { jwtConstants } from "src/auth/constants";
import { Out } from "src/out/outdata.entity";
import { GoingoutDataService } from "src/out/outdata.service";
import { Student } from "src/student/userdata.entity";
import { StudentService } from "src/student/userdata.service";
import { GoingService } from "./going.service";

@Module({
  imports: [TypeOrmModule.forFeature([Out, Student])],
  providers: [GoingService, GoingoutDataService, StudentService],
})
export class GoingModule {}
