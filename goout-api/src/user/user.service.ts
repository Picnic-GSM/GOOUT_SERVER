import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { hashSha512 } from "src/util/hash";
import { CreateStudentDto } from "./dto/create-student.dto";
import { validate } from "email-validator";

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
  findOneWithId(id: number): Promise<Student | undefined> {
    return this.studentRepository.findOne({ idx: id });
  }

  // 이메일을 통한 학생 데이터 검색
  findOneWithEmail(email: string): Promise<Student | undefined> {
    return this.studentRepository.findOne({ email: email });
  }

  // 각 학년 학생 데이터 조회
  findAllWithGrade(grade: number): Promise<Student[]> {
    if (!(1 <= grade && grade <= 4)) {
      return;
    }
    return this.studentRepository.find({ grade: grade });
  }

  // 각 반의 학생 데이터 조회
  findAllWithGradeAndClass(grade: number, s_class: number) {
    if (!(this.isValidGrade && this.isValidClass)) {
      return;
    }
    return this.studentRepository.find({
      grade: grade,
      class: s_class,
    });
  }

  // 이메일, 비밀번호 확인
  async validator(
    email: string,
    password: string
  ): Promise<Student | undefined> {
    const hashedPassword = hashSha512(password);
    return this.studentRepository.findOne({
      email: email,
      password: hashedPassword,
    });
  }

  // 학년 validator
  isValidGrade(grade: number): Boolean {
    if (!(1 <= grade && grade <= 3)) {
      return false;
    }
    return true;
  }
  // 학년 validator
  isValidClass(s_class: number): Boolean {
    if (!(1 <= s_class && s_class <= 4)) {
      return false;
    }
    return true;
  }

  // 번호 validator
  isValidNumber(s_number: number): Boolean {
    if (!(1 <= s_number && s_number <= 21)) {
      return;
    }
    return true;
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

  async remove(id: string): Promise<void> {
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

  async findOneWithActivateCode(code: number): Promise<Teacher> {
    return await this.teacherRepository.findOne({ activateCode: code });
  }

  async findOneWithGrade(grade: number): Promise<Teacher> {
    return await this.teacherRepository.findOne({ grade: grade });
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
