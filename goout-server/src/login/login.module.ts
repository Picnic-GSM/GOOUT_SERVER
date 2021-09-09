import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Teacherdata } from "src/teacherdata/teacherdata.entity";
import { TeacherdataService } from "src/teacherdata/teacherdata.service";
import { Userdata } from "src/userdata/userdata.entity";
import { UserdataService } from "src/userdata/userdata.service";

@Module({
  imports: [TypeOrmModule.forFeature([Teacherdata, Userdata])],
  providers: [UserdataService, TeacherdataService],
})
export class LoginModule {}
