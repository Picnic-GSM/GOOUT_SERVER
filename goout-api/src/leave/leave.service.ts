import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StudentDataService } from "src/user/user.service";
import { Leave } from "./entites/leave.entity";
import { Student } from "src/user/entites/student.entity";
import { async } from "rxjs";
import { CreateLeaveDataDto } from "./dto/create-leave.dto";

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
    return this.leaveRepository.findOne({ relations: ["Student"] });
  }

  // Todo
  create(obj: CreateLeaveDataDto) {
    try {
      this.leaveRepository.save(obj);
    } catch (error) {
      throw new HttpException("저장 중 에러 발생.", HttpStatus.BAD_REQUEST);
    }
  }

  async findWithClass(grade: number): Promise<Leave> {
    let leaveData = await this.leaveRepository.find({ status: 3 });
    let userData: Student;
    let returnData;
    leaveData.forEach(async (i) => {
      userData = await this.studentDataService.findOneWithId(i.student.idx);
      if (userData.grade == grade) {
        returnData.push(i);
      }
    });
    return returnData;
  }

  async findWithGradeClass(grade: number, class_n: number): Promise<Leave> {
    let user_data: Student;
    let return_data;
    let leave_data = await this.leaveRepository.find({ status: 3 });
    await leave_data.forEach(async (each_leave) => {
      user_data = await this.studentDataService.findOneWithId(
        each_leave.student.idx
      );
      if (user_data.grade == grade && user_data.class == class_n) {
        return_data.push(each_leave);
      }
    });
    return return_data;
  }

  async find_with_request_check(status: number) {
    return await this.leaveRepository.find({ status: status });
  }

  async checkRequest(id: number, response: number) {
    const updatedata = await this.leaveRepository.findOne({ idx: id });
    updatedata.status = 2;
    await this.leaveRepository.save(updatedata);
  }

  async remove(id: string): Promise<void> {
    await this.leaveRepository.delete(id);
  }
}
