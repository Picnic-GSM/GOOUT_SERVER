import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/user/entites/student.entity';
import { Teacher } from 'src/user/entites/teacher.entity';
import { StudentDataService, TeacherDataService } from 'src/user/user.service';
import { RedisService } from 'src/util/redis';
import { AuthService } from './auth.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '12h' },
        }),
        TypeOrmModule.forFeature([Student, Teacher]),
        CacheModule.register(),
    ],
    providers: [
        AuthService,
        StudentDataService,
        TeacherDataService,
        RedisService,
    ],
    exports: [AuthService],
})
export class AuthModule {}
