import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { OutController } from "./out.controller";
import { outProviders } from "./out.providers";
import { OutDataService } from "./out.service";

@Module({
  imports: [DatabaseModule],
  providers: [...outProviders, OutDataService],
  controllers: [OutController],
})
export class OutModule {}
