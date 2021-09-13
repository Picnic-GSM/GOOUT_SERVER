import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StudentDataService } from "src/user/user.service";
import { Leave } from "./entites/leave.entity";
import { Student } from "src/user/entites/student.entity";
import { async } from "rxjs";

@Injectable()
export class LeaveDataService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    private readonly studentDataService: StudentDataService
  ) {}

  getData(): Promise<Leave[]> {
    return this.leaveRepository.find();
  }

  findOne(id: number): Promise<Leave> {
    return this.leaveRepository.findOne({ user_id: id });
  }

  // Todo
  createLeaveData() {}

  async findWithClass(grade: number): Promise<Leave> {
    let leaveData = await this.leaveRepository.find({ status: 2 });
    let userData: Student;
    let returnData;
    leaveData.forEach(async (i) => {
      userData = await this.studentDataService.findOne(i.user_id);
      if (userData.grade == grade) {
        returnData.push(i);
      }
    });
    return returnData;
  }

  async findWithGradeClass(grade: number, class_n: number): Promise<Leave> {
    let user_data: Student;
    let return_data;
    let leave_data = await this.leaveRepository.find({ status: 2 });
    await leave_data.forEach(async (each_leave) => {
      user_data = await this.studentDataService.findOne(each_leave.user_id);
      if (user_data.grade == grade && user_data.class == class_n) {
        return_data.push(each_leave);
      }
    });
    return return_data;
  }

  async checkRequest(id: number) {
    const updatedata = await this.leaveRepository.findOne({ id: id });
    updatedata.status = 2;
    await this.leaveRepository.save(updatedata);
  }

  async remove(id: string): Promise<void> {
    await this.leaveRepository.delete(id);
  }
}
