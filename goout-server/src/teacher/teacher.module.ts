import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Teacher } from "./teacher.entity";
import { TeacherdataService } from "./teacher.service";

@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  providers: [TeacherdataService],
  exports: [TypeOrmModule],
})
export class TeacherdataModule {}
