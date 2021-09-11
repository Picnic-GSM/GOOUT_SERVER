import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GoingService } from "src/going/going.service";
import { Student } from "src/student/userdata.entity";
import { StudentService } from "src/student/userdata.service";
import { Repository } from "typeorm";
import { Out } from "./outdata.entity";
import { CreateGoingDto } from "./outdata.interface";

@Injectable()
export class GoingoutDataService {
  constructor(
    @InjectRepository(Out)
    private goingoutRepository: Repository<Out>,
    private readonly userdataservice: StudentService
  ) {}

  async createGoingout(createGoingDto: CreateGoingDto) {
    let goingtime = createGoingDto.end_at;
    let hour = Number(goingtime.substring(0, goingtime.indexOf(":")));
    let min = Number(goingtime.substring(goingtime.indexOf(":") + 1, 5));
    let time = new Date();
    let nowhour = time.getHours();
    let nowmin = time.getMinutes();
    if(createGoingDto.status == "미승인") {
      if (nowhour > hour) {
        createGoingDto.status = "지각";
      } else if (nowhour == hour) {
        if (nowmin > min) {
          createGoingDto.status = "지각";
        } else {
          createGoingDto.status = "외출중";
        }
      } else {
        createGoingDto.status = "외출중";
      }
    }
    return await this.goingoutRepository.save(createGoingDto);
  }
  async getData(): Promise<Out[]> {
    return await this.goingoutRepository.find({ status: "승인" });
  }

  findOne(id: number): Promise<Out> {
    return this.goingoutRepository.findOne({ user_id: id });
  }
  async findwithclass(grade: number): Promise<Out[]> {
    let goingdata = await this.goingoutRepository.find({ status: "승인" });
    let user_data: Student;
    let return_data: Out[];
    goingdata.forEach(async (i) => {
      user_data = await this.userdataservice.findOne(i.user_id);
      if (user_data.grade == grade) {
        return_data.push(i);
      }
    });
    return await return_data;
  }
  async find_with_grade_class(
    grade: number,
    class1: number
  ): Promise<Out[]> {
    let user_data: Student;
    let return_data: Out[];
    let going_data = await this.goingoutRepository.find({ status: "승인" });
    await going_data.forEach(async (each_going) => {
      user_data = await this.userdataservice.findOne(each_going.user_id);
      if (user_data.grade == grade && user_data.class == class1) {
        return_data.push(each_going);
      }
    });
    return return_data;
  }
  async find_with_request_check(request: string): Promise<Out[]> {
    return await this.goingoutRepository.find({ status: request });
  }
  async updateGoingdata(id: number, going_status: string) {
    const updatedata = await this.goingoutRepository.findOne({
      id: id,
    });
    updatedata.status = going_status;
    await this.goingoutRepository.save(updatedata);
  }
  async update_GoingRequestdata(id: number, going_request: string) {
    const updatedata = await this.goingoutRepository.findOne({
      id: id,
    });
    updatedata.status = going_request;
    await this.goingoutRepository.save(updatedata);
  }
  async remove(id: string): Promise<void> {
    await this.goingoutRepository.delete(id);
  }
}
