import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Leavedata } from "./leavedata.entity";
import * as crypto from "crypto";
import { CreateLeavedataDto } from "./leavedata.interface";

@Injectable()
export class LeavedataService {
  constructor(
    @InjectRepository(Leavedata)
    private usersRepository: Repository<Leavedata>
  ) {}

  async createLeavedata(createLeaveDto: CreateLeavedataDto) {
    return this.usersRepository.save(createLeaveDto);
  }
  getData(): Promise<Leavedata[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Leavedata> {
    return this.usersRepository.findOne(id);
  }
  findwithclass(grade: number): Promise<Leavedata> {
    return this.usersRepository.findOne({ grade: grade });
  }
  /*
  async updateLeavedata(updateLeavedataDto) {
    const updatedata = await this.usersRepository.findOne({userid:updateLeavedataDto.userid});
    updatedata.username = updateLeavedataDto.username;
    updatedata.email = updateLeavedataDto.email;
    await this.usersRepository.save(updatedata);
  }
*/
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
