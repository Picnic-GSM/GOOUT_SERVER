import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/student/userdata.entity";
import { StudentService } from "src/student/userdata.service";
import { authnumService } from "src/util/authnum.service";
import { RedisService } from "src/util/redis.service";

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentService, authnumService,RedisService],
})
export class RegisterModule {}
