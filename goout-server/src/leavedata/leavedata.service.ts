import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "src/student/userdata.entity";
import { StudentService } from "src/student/userdata.service";
import { Repository } from "typeorm";
import { Leave } from "./leavedata.entity";
import { CreateLeavedataDto } from "./leavedata.interface";

@Injectable()
export class LeavedataService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    private readonly userdataservice: StudentService
  ) {}

  async createLeavedata(createLeaveDto: CreateLeavedataDto) {
    createLeaveDto.status = "미승인";
    return this.leaveRepository.save(createLeaveDto);
  }
  getData(): Promise<Leave[]> {
    return this.leaveRepository.find({ status: "승인" });
  }

  findOne(id: number): Promise<Leave> {
    return this.leaveRepository.findOne({user_id:id});
  }
  async findwithclass(grade: number): Promise<Leave> {
    let leavedata = await this.leaveRepository.find({ status: "승인" });
    let user_data: Student;
    let return_data;
    leavedata.forEach(async (i) => {
      user_data = await this.userdataservice.findOne(i.user_id);
      if (user_data.grade == grade) {
        return_data.push(i);
      }
    });
    return return_data;
  }
  async find_with_grade_class(
    grade: number,
    class1: number
  ): Promise<Leave> {
    let user_data: Student;
    let return_data;
    let leave_data = await this.leaveRepository.find({ status: "승인" });
    await leave_data.forEach(async (each_leave) => {
      user_data = await this.userdataservice.findOne(each_leave.user_id);
      if (user_data.grade == grade && user_data.class == class1) {
        return_data.push(each_leave);
      }
    });
    return return_data;
  }
  find_with_request_check(request: string): Promise<Leave[]> {
    return this.leaveRepository.find({ status: request });
  }
  async CheckRequest(id: number) {
    const updatedata = await this.leaveRepository.findOne({ id: id });
    updatedata.status = "승인";
    await this.leaveRepository.save(updatedata);
  }
  async remove(id: string): Promise<void> {
    await this.leaveRepository.delete(id);
  }
}
