import { CacheModule, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import {
    InputValidator,
    LoginController,
    StudentController,
    TeacherController,
} from './user.controller';
import { Student } from './entites/student.entity';
import { Teacher } from './entites/teacher.entity';

import { studentProviders, teacherProviders } from './user.providers';
import { StudentDataService, TeacherDataService } from './user.service';
import { RedisService } from 'src/util/redis';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Student, Teacher]),
        AuthModule,
        CacheModule.register({
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
        }),
        ConfigModule.forRoot(),
    ],
    providers: [
        ...studentProviders,
        ...teacherProviders,
        StudentDataService,
        TeacherDataService,
        InputValidator,
        RedisService,
    ],
    controllers: [LoginController, StudentController, TeacherController],
})
export class UserModule {}
