import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entites/student.entity";
import { Teacher } from "./entites/teacher.entity";
import { LoginDataDto } from "./dto/login.dto";
import { RedisService } from "src/util/redis";
import * as nodemailer from 'nodemailer'

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
    this.usersRepository.save(data);
  }
}

@Injectable()
export class TeacherDataService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
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

export class UserService {
  constructor(private readonly studentdataservice:StudentDataService, private readonly redisService:RedisService) {}
  async sendMail(id:number) {
    try {
      
      console.log(id);
      const userEmail = await this.studentdataservice.findOne(id);
      console.log(userEmail);
      let authNum = await Number(Math.random().toString().substr(2, 6));

      const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: userEmail.email,
        subject: "Go-Out 회원가입 E-Mail인증번호",
        text: `인증번호는 ${authNum}입니다.`,
      };
      
      await smtpTransport.sendMail(mailOptions, (err) => {
        if(err) console.log(err)
      });
      console.log("인증번호:" + authNum);
      this.redisService.add_redis(id, authNum, 180);
      return "회원가입 성공";
    } catch (error) {
      console.log(error);
      throw new HttpException("이메일 전송 에러", HttpStatus.CONFLICT);
    }
  }
}
