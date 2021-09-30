import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { hashSha512 } from "src/util/hash";
import { CreateStudentDto } from "./dto/create-student.dto";
import { validate } from "email-validator";
import { RedisService } from "src/util/redis";
import * as nodemailer from "nodemailer";

@Injectable()
export class StudentDataService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
  ) {}

  // 학생 데이터 생성
  async create(studentObj: CreateStudentDto): Promise<Student | undefined> {
    let hashedPassword = hashSha512(studentObj.password);
    studentObj.password = hashedPassword;
    return await this.studentRepository.save(studentObj);
  }

  // 모든 학생 데이터 조회
  findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  // 인덱스를 통한 학생 데이터 검색
  async findOneWithId(id: number): Promise<Student> {
    return await this.studentRepository.findOne(id);
  }

  // 이메일을 통한 학생 데이터 검색
  findOneWithEmail(email: string): Promise<Student | undefined> {
    return this.studentRepository.findOne({ email: email });
  }

  // 각 학년 학생 데이터 조회
  findAllWithGrade(grade: number): Promise<Student[]> {
    if (!(1 <= grade && grade <= 4)) {
      throw new HttpException(
        "1~3 내의 숫자를 입력해주세요",
        HttpStatus.BAD_REQUEST
      );
    }
    return this.studentRepository.find({ grade: grade });
  }

  // 각 반의 학생 데이터 조회
  findAllWithGradeAndClass(grade: number, s_class: number) {
    return this.studentRepository.find({
      grade: grade,
      class: s_class,
    });
  }

  // 이메일, 비밀번호 확인
  async validator(email: string, password: string): Promise<Student> {
    const hashedPassword = hashSha512(password);
    return this.studentRepository.findOne({
      email: email,
      password: hashedPassword,
    });
  }

  // 계정 활성화 여부
  async isActive(id: number): Promise<boolean> {
    const obj = await this.studentRepository.findOne({
      idx: id,
      is_active: true,
    });
    return obj ? true : false;
  }

  // 학생 게정 활성화
  async activateAccount(id: number) {
    const studentObj = await this.findOneWithId(id);
    if (!studentObj) {
      return;
    }
    studentObj.is_active = true;
    return this.studentRepository.save(studentObj);
  }

  // 학생 게정 삭제
  async remove(id: number): Promise<void> {
    await this.studentRepository.delete(id);
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

  async findOneWithActivateCode(code: string): Promise<Teacher> {
    return await this.teacherRepository.findOne({ activateCode: code });
  }

  async findAllWithGrade(grade: number): Promise<Teacher[]> {
    return await this.teacherRepository.find({ grade: grade });
  }

  async findOneWithGradeAndClass(
    teacherGrade: number,
    teacher_class: number
  ): Promise<Teacher> {
    return await this.teacherRepository.findOne({
      grade: teacherGrade,
      class: teacher_class,
    });
  }
}
