import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./userdata.entity";
import * as crypto from "crypto";
import { LoginDataDto } from "./login.interface";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private usersRepository: Repository<Student>
  ) {}

  async createUserdata(createUserDto: LoginDataDto) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.key);
    let result = cipher.update(createUserDto.password, 'utf8', 'base64');
    result += cipher.final('base64');
    createUserDto.password = await result;
    let create_result = await this.usersRepository.save(createUserDto);
    return create_result;
    
  }
  getData(): Promise<Student[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Student> {
    return this.usersRepository.findOne(id);
  }
  findOnewithUserid(userid: number): Promise<Student> {
    return this.usersRepository.findOne(userid);
  }
  findwithEmail(email: string): Promise<Student> {
    return this.usersRepository.findOne({ email: email });
  }
  /*
  async updateUserdata(updateUserdataDto:IUpdateUserdata) {
    const updatedata = await this.usersRepository.findOne({userid:updateUserdataDto.userid});
    updatedata.username = updateUserdataDto.username;
    updatedata.email = updateUserdataDto.email;
    await this.usersRepository.save(updatedata);
  }*/

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
