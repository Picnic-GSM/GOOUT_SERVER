import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Teacher } from "./teacher.entity";

@Injectable()
export class TeacherdataService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherrepository: Repository<Teacher>
  ) {}
  getData(): Promise<Teacher[]> {
    return this.teacherrepository.find();
  }
  findOne(id: string): Promise<Teacher> {
    return this.teacherrepository.findOne(id);
  }

  async findOnewithCode(teachercode: number): Promise<Teacher> {
    return await this.teacherrepository.findOne({ teachercode: teachercode });
  }
}
