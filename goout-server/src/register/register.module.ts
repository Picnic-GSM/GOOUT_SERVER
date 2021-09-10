import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Userdata } from "src/userdata/userdata.entity";
import { UserdataService } from "src/userdata/userdata.service";
import { RedisService } from "src/util/redis.service";
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([Userdata])],
  providers: [UserdataService, RegisterService,RedisService],
})
export class RegisterModule {}
