import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GoingService } from "src/going/going.service";
import { Repository } from "typeorm";
import { Goingoutdata } from "./goingoutdata.entity";
import { CreateGoingDto } from "./goingoutdata.interface";

@Injectable()
export class GoingoutDataService {
  constructor(
    @InjectRepository(Goingoutdata)
    private goingoutRepository: Repository<Goingoutdata>
  ) {}

  async createGoingout(createGoingDto: CreateGoingDto) {
    let goingtime = createGoingDto.end_time;
    let hour = Number(goingtime.substring(0, goingtime.indexOf(":")));
    let min = Number(goingtime.substring(goingtime.indexOf(":") + 1, 5));
    let time = new Date();
    let nowhour = time.getHours();
    let nowmin = time.getMinutes();
    if (nowhour > hour) {
      createGoingDto.going_status = "지각";
    } else if (nowhour == hour) {
      if (nowmin > min) {
        createGoingDto.going_status = "지각";
      } else {
        createGoingDto.going_status = "외출중";
      }
    } else {
      createGoingDto.going_status = "외출중";
    }
    createGoingDto.request = 0;
    createGoingDto.back_check = 0;
    return await this.goingoutRepository.save(createGoingDto);
  }
  async getData(): Promise<Goingoutdata[]> {
    return await this.goingoutRepository.find({ request: 1 });
  }

  findOne(id: string): Promise<Goingoutdata> {
    return this.goingoutRepository.findOne(id);
  }
  async findwithclass(grade: number): Promise<Goingoutdata[]> {
    return await this.goingoutRepository.find({ grade: grade, request: 1 });
  }
  async find_with_grade_class(
    grade: number,
    class1: number
  ): Promise<Goingoutdata[]> {
    return await this.goingoutRepository.find({
      grade: grade,
      class: class1,
      request: 1,
    });
  }
  async find_with_request_check(request: number): Promise<Goingoutdata[]> {
    return await this.goingoutRepository.find({ request: request });
  }
  async updateGoingdata(goingid: number, going_status: string) {
    const updatedata = await this.goingoutRepository.findOne({
      goingid: goingid,
    });
    updatedata.going_status = going_status;
    await this.goingoutRepository.save(updatedata);
  }
  async update_GoingRequestdata(goingid: number, going_request: number) {
    const updatedata = await this.goingoutRepository.findOne({
      goingid: goingid,
    });
    updatedata.request = going_request;
    await this.goingoutRepository.save(updatedata);
  }
  async remove(id: string): Promise<void> {
    await this.goingoutRepository.delete(id);
  }
}
