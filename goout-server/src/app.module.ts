import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { Userdata } from './userdata/userdata.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserdataService } from './userdata/userdata.service';
import { UserdataModule } from './userdata/userdata.module';
import { AuthModule } from './auth/auth.module';
import { LeavedataModule } from './leavedata/leavedata.module';
import { LeaveController } from './leave/leave.controller';
import { LeaveModule } from './leave/leave.module';
import { RegisterController } from './register/register.controller';
import { RegisterModule } from './register/register.module';
import { Leavedata } from './leavedata/leavedata.entity';
import { LeavedataService } from './leavedata/leavedata.service';
import { GoingoutdataModule } from './goingoutdata/goingoutdata.module';
import { Goingoutdata } from './goingoutdata/goingoutdata.entity';
import { GoingController } from './going/going.controller';
import { GoingModule } from './going/going.module';
import { GoingoutDataService } from './goingoutdata/goingoutdata.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Userdata,Leavedata,Goingoutdata],
      synchronize: true,
    }), 
LoginModule, UserdataModule, AuthModule, LeavedataModule, LeaveModule, RegisterModule, GoingoutdataModule, GoingModule],
  controllers: [AppController, LoginController, LeaveController, RegisterController, GoingController],
  providers: [AppService, LoginService,UserdataService,LeavedataService,GoingoutDataService],
})
export class AppModule {}
