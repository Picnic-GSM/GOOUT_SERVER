import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { LoginDataDto } from "./dto/login.dto";

@Injectable()
export class StudentDataService {
  constructor(
    @InjectRepository(Student)
    private usersRepository: Repository<Student>
  ) {}

  async create(createUserDto: LoginDataDto) {
    const cipher = crypto.createCipher("aes-256-cbc", process.env.key);
    let result = cipher.update(createUserDto.password, "utf8", "base64");
    result += cipher.final("base64");
    createUserDto.password = await result;
    let create_result = await this.usersRepository.save(createUserDto);
    return create_result;
  }

  findAll(): Promise<Student[]> {
    return this.usersRepository.find();
  }

  findOneWithId(id: number): Promise<Student> {
    return this.usersRepository.findOneOrFail(id);
  }

  findOneWithEmail(email: string): Promise<Student> {
    return this.usersRepository.findOne({ email: email });
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

@Injectable()
export class TeacherDataService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>
  ) {}

  getData(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  findOne(id: string): Promise<Teacher> {
    return this.teacherRepository.findOne(id);
  }

  async findOneWithActivateCode(code: number): Promise<Teacher> {
    return await this.teacherRepository.findOne({ activateCode: code });
  }
}
