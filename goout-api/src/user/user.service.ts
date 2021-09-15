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
    /*
    const cipher = crypto.createCipher("aes-256-cbc", process.env.key);
    let result = cipher.update(createUserDto.password, "utf8", "base64");
    result += cipher.final("base64");
    createUserDto.password = await result;
    */
    let create_result = await this.usersRepository.save(createUserDto);
    return create_result;
  }

  findAll(): Promise<Student[]> {
    return this.usersRepository.find();
  }

  async findOne(id:number) {
    return await this.usersRepository.findOne(id)
  }

  async findOneWithId(id: number): Promise<Student> {
    console.log(id)
    return await this.usersRepository.findOne(id);
  }

  findOneWithEmail(email: string): Promise<Student> {
    return this.usersRepository.findOne({ email: email });
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  //인증 확인 후 활성화 시키는 메서드
  async Activating(id:number) {
    let data = await this.usersRepository.findOne(id);
    data.is_active = true;
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

  async findOneWithGrade(grade: number): Promise<Teacher> {
    return await this.teacherRepository.findOne({ grade: grade });
  }

  async findOneWithGradeAndClass(teacherGrade:number,teacher_class:number): Promise<Teacher> {
    return await this.teacherRepository.findOne({ grade:teacherGrade,class:teacher_class });
  }
}
