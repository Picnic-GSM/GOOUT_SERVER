import { Injectable, Logger } from "@nestjs/common";
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
    return this.outRepository.save(obj);
  }
  check_status(obj: Out[]) {
    obj.forEach((element) => {
      if (element.status == 3) {
        let objTime = element.end_at.toISOString();

        let hour = Number(objTime.substring(0, objTime.indexOf(":")));
        let min = Number(objTime.substring(objTime.indexOf(":") + 1, 5));

        let currentTime = new Date();
        let nowhour = currentTime.getHours();
        let nowmin = currentTime.getMinutes();

        console.log(
          `objTime - hour : ${hour} <-> currentTime - hour : ${nowhour}
           objTime - min : ${min} <-> currentTime - min : ${nowmin}`
        );
        if (nowhour > hour) {
          element.status = 5;
        } else if (nowhour == hour) {
          if (nowmin > min) {
            element.status = 5;
          } else if (nowhour == hour) {
            if (nowmin > min) {
              element.status = 5;
            } else {
              element.status = 3;
            }
          } else {
            element.status = 3;
          }
        }
      }
    });

    return this.outRepository.save(obj);
  }

  async getData(): Promise<Out[]> {
    return await this.outRepository.find();
  }

  findOne(id: number): Promise<Out> {
    return this.outRepository.findOne({ relations: ["Student"] });
  }
  async findwithclass(grade: number): Promise<Out[]> {
    let goingdata = await this.outRepository.find({ status: 3 });
    let user_data: Student;
    let return_data: Out[];
    goingdata.forEach(async (i) => {
      user_data = await this.studentDataService.findOneWithId(i.student.idx);
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
        each_going.student.idx
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
  async updateGoingdata(id: number, going_status: number) {
    const updateObj = await this.outRepository.findOne({
      idx: id,
    });
    updateObj.status = going_status;
    await this.outRepository.save(updateObj);
  }
  async update_GoingRequestdata(id: number, going_request: number) {
    const updateObj = await this.outRepository.findOne({
      idx: id,
    });
    updateObj.status = going_request;
    await this.outRepository.save(updateObj);
  }
  async remove(id: string): Promise<void> {
    await this.outRepository.delete(id);
  }
}
