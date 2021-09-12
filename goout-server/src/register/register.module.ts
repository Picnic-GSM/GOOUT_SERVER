import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Userdata } from "src/userdata/userdata.entity";
import { UserdataService } from "src/userdata/userdata.service";
import { authnumService } from "src/util/authnum.service";
import { RedisService } from "src/util/redis.service";

@Module({
  imports: [TypeOrmModule.forFeature([Userdata])],
  providers: [UserdataService, authnumService,RedisService],
})
export class RegisterModule {}
