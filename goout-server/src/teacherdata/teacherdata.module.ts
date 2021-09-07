import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherData } from './teacherdata.entity';
import { TeacherdataService } from './teacherdata.service';

@Module({
    imports: [TypeOrmModule.forFeature([TeacherData])],
    providers:[TeacherdataService],
    exports:[TypeOrmModule]})
export class TeacherdataModule {}
