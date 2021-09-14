import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import { Student } from "src/user/entites/student.entity";
import { StudentDataService } from "src/user/user.service";
import { Out } from "./entities/out.entity";
import { OutController } from "./out.controller";
import { outProviders } from "./out.providers";
import { OutDataService } from "./out.service";

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Out,Student]),AuthModule],
  providers: [OutDataService, ...outProviders,StudentDataService],
  controllers: [OutController],
})
export class OutModule {}
