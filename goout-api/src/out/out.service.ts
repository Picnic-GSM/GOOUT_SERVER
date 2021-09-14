import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "src/user/entites/student.entity";
import { StudentDataService } from "src/user/user.service";
import { Repository } from "typeorm";
import { Out } from "./entities/out.entity";
import { CreateOutDataDto } from "./dto/create-out.dto";

@Injectable()
export class OutDataService {
  constructor(
    @InjectRepository(Out)
    private outRepository: Repository<Out>,
    private readonly studentDataService: StudentDataService
  ) {}

  async create(obj: CreateOutDataDto) {
    let goingtime = obj.end_at;
    let hour = Number(goingtime.substring(0, goingtime.indexOf(":")));
    let min = Number(goingtime.substring(goingtime.indexOf(":") + 1, 5));
    let time = new Date();
    let nowhour = time.getHours();
    let nowmin = time.getMinutes();

    if (obj.status == "미승인") {
      if (nowhour > hour) {
        obj.status = "지각";
      } else if (nowhour == hour) {
        if (nowmin > min) {
          obj.status = "지각";
        } else {
          obj.status = "외출중";
        }
      } else {
        obj.status = "외출중";
      }
    }

    return await this.outRepository.save(obj);
  }
  async getData(): Promise<Out[]> {
    return await this.outRepository.find({ status: 3 });
  }

  findOne(id: number): Promise<Out> {
    return this.outRepository.findOne({ user_id: id });
  }
  async findwithclass(grade: number): Promise<Out[]> {
    let goingdata = await this.outRepository.find({ status: 3 });
    let user_data: Student;
    let return_data: Out[];
    goingdata.forEach(async (i) => {
      user_data = await this.studentDataService.findOneWithId(i.user_id);
      if (user_data.grade == grade) {
        return_data.push(i);
      }
    });
    return await return_data;
  }
  async find_with_grade_class(grade: number, class1: number): Promise<Out[]> {
    let user_data: Student;
    let return_data: Out[];
    let going_data = await this.outRepository.find({ status: 3 });
    await going_data.forEach(async (each_going) => {
      user_data = await this.studentDataService.findOneWithId(
        each_going.user_id
      );
      if (user_data.grade == grade && user_data.class == class1) {
        return_data.push(each_going);
      }
    });
    return return_data;
  }
  async find_with_request_check(request: number): Promise<Out[]> {
    return await this.outRepository.find({ status: request });
  }
  async updateGoingdata(id: number, going_status: string) {
    const updatedata = await this.outRepository.findOne({
      id: id,
    });
    updatedata.status = going_status;
    await this.outRepository.save(updatedata);
  }
  async update_GoingRequestdata(id: number, going_request: string) {
    const updatedata = await this.outRepository.findOne({
      id: id,
    });
    updatedata.status = going_request;
    await this.outRepository.save(updatedata);
  }
  async remove(id: string): Promise<void> {
    await this.outRepository.delete(id);
  }
}
