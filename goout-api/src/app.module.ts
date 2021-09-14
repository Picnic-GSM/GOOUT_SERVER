import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

// Module
import { OutModule } from "./out/out.module";
import { UserModule } from "./user/user.module";
import { LeaveModule } from "./leave/leave.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";

// Entity
import { Student } from "./user/entites/student.entity";
import { Leave } from "./leave/entites/leave.entity";
import { Out } from "./out/entities/out.entity";
import { Teacher } from "./user/entites/teacher.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OutModule,
    UserModule,
    LeaveModule,
    AuthModule,
    DatabaseModule,
  ],
})
export class AppModule {}
