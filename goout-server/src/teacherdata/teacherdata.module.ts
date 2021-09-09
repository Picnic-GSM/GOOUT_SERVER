import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacherdata } from './teacherdata.entity';
import { TeacherdataService } from './teacherdata.service';

@Module({
    imports: [TypeOrmModule.forFeature([Teacherdata])],
    providers:[TeacherdataService],
    exports:[TypeOrmModule]})
export class TeacherdataModule {}
