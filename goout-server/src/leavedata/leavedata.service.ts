import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leavedata } from './leavedata.entity';
import { CreateLeavedataDto } from './leavedata.interface';

@Injectable()
export class LeavedataService {
  constructor(
    @InjectRepository(Leavedata)
    private leaveRepository: Repository<Leavedata>,
  ) {}

  async createLeavedata(createLeaveDto: CreateLeavedataDto) {
    return this.leaveRepository.save(createLeaveDto);
  }
  getData(): Promise<Leavedata[]> {
    return this.leaveRepository.find();
  }

  findOne(id: string): Promise<Leavedata> {
    return this.leaveRepository.findOne(id);
  }
  findwithclass(grade: number): Promise<Leavedata> {
    return this.leaveRepository.findOne({grade:grade});
  }
  find_with_grade_class(grade: number,class2:number): Promise<Leavedata> {
    return this.leaveRepository.findOne({grade:grade,class:class2});
  }
  find_with_request_check(request: number): Promise<Leavedata[]> {
    return this.leaveRepository.find({request:request});
  }
  async CheckRequest(leaveid:number) {
    const updatedata = await this.leaveRepository.findOne({leaveid:leaveid});
    updatedata.request = 1;
    await this.leaveRepository.save(updatedata);
  }
  async remove(id: string): Promise<void> {
    await this.leaveRepository.delete(id);
  }
}