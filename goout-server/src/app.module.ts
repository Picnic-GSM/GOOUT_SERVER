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
import { RegisterController } from './register/register.controller';
import { RegisterModule } from './register/register.module';

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
      entities: [Userdata],
      synchronize: true,
    }), 
LoginModule, UserdataModule, AuthModule, RegisterModule],
  controllers: [AppController, LoginController, RegisterController],
  providers: [AppService, LoginService,UserdataService],
})
export class AppModule {}
