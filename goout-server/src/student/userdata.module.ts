import { Module } from "@nestjs/common";
import { StudentService } from "./userdata.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "./userdata.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentService],
  exports: [TypeOrmModule],
})
export class UserdataModule {}
