import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goingoutdata } from './goingoutdata.entity';

@Injectable()
export class GoingoutDataService {
  constructor(
    @InjectRepository(Goingoutdata)
    private usersRepository: Repository<Goingoutdata>,
  ) {}

  async createGoingout(createGoingDto) {
    return this.usersRepository.save(createGoingDto);
  }
  getData(): Promise<Goingoutdata[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Goingoutdata> {
    return this.usersRepository.findOne(id);
  }
  findwithclass(grade: number): Promise<Goingoutdata> {
    return this.usersRepository.findOne({});
  }
  async updateGoingdata(goingid:number,going_status:string) {
    const updatedata = await this.usersRepository.findOne({goingid:goingid});
    updatedata.going_status = going_status;
    await this.usersRepository.save(updatedata);
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}