import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherData } from './teacherdata.entity';

@Injectable()
export class TeacherdataService {
    constructor(
        @InjectRepository(TeacherData)
        private readonly teacherrepository:Repository<TeacherData>
    ) {}

    findOne(id: string): Promise<TeacherData> {
        return this.teacherrepository.findOne(id);
    }

    findOnewithCode(teachercode: string): Promise<TeacherData> {
        return this.teacherrepository.findOne({teachercode:teachercode});
    }
}
