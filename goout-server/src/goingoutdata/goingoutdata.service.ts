import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goingoutdata } from './goingoutdata.entity';

@Injectable()
export class GoingoutDataService {
  constructor(
    @InjectRepository(Goingoutdata)
    private goingoutRepository: Repository<Goingoutdata>,
  ) {}

  async createGoingout(createGoingDto) {
    return this.goingoutRepository.save(createGoingDto);
  }
  getData(): Promise<Goingoutdata[]> {
    return this.goingoutRepository.find();
  }

  findOne(id: string): Promise<Goingoutdata> {
    return this.goingoutRepository.findOne(id);
  }
  findwithclass(grade: number): Promise<Goingoutdata> {
    return this.goingoutRepository.findOne({grade:grade});
  }
  async updateGoingdata(goingid:number,going_status:string) {
    const updatedata = await this.goingoutRepository.findOne({goingid:goingid});
    updatedata.going_status = going_status;
    await this.goingoutRepository.save(updatedata);
  }
  async remove(id: string): Promise<void> {
    await this.goingoutRepository.delete(id);
  }
}