import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

// Module
import { OutModule } from './out/out.module';
import { UserModule } from './user/user.module';
import { LeaveModule } from './leave/leave.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

// Entity
import { Leave } from './leave/entites/leave.entity';
import { Out } from './out/entities/out.entity';
import { Student } from './user/entites/student.entity';
import { Teacher } from './user/entites/teacher.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [Leave, Out, Student, Teacher],
            synchronize: true,
        }),
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
        }),
        OutModule,
        UserModule,
        LeaveModule,
        AuthModule,
        DatabaseModule,
    ],
})
export class AppModule {}
