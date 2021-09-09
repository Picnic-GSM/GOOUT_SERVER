import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacherdata } from './teacherdata.entity';

@Injectable()
export class TeacherdataService {
    constructor(
        @InjectRepository(Teacherdata)
        private readonly teacherrepository:Repository<Teacherdata>
    ) {}
    getData(): Promise<Teacherdata[]> {
        return this.teacherrepository.find();
      }
    findOne(id: string): Promise<Teacherdata> {
        return this.teacherrepository.findOne(id);
    }

    async findOnewithCode(teachercode: string): Promise<Teacherdata> {
        return await this.teacherrepository.findOne({teachercode:teachercode});
    }
}
