import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Userdata } from "src/userdata/userdata.entity";
import { UserdataService } from "src/userdata/userdata.service";
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([Userdata])],
  providers: [UserdataService, RegisterService],
})
export class RegisterModule {}
