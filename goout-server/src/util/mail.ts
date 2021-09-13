import { RegisterAuthNumCheck } from "src/register/registerAuth.interface";
import { StudentService } from "src/student/userdata.service";
import { RedisService } from "./redis";
import * as nodemailer from "nodemailer";
import { HttpException, HttpStatus } from "@nestjs/common";

export class SendEmail {
  constructor(
    private readonly studentDataService: StudentService,
    private readonly redisService: RedisService
  ) {}

  async sendMail(req: RegisterAuthNumCheck) {
    let authNum = this.makeAuthCode();
    try {
      const smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: req.email,
        subject: "Go-Out 회원가입 E-Mail인증번호",
        text: `인증번호는 ${authNum}입니다.`,
      };
      let created_data = await this.studentDataService.createUserdata(req);
      this.redisService.add_redis(created_data.id, authNum, 180);
    } catch (error) {
      console.log(error);
      throw new HttpException("이메일 전송 에러", HttpStatus.CONFLICT);
    }
  }

  async makeAuthCode() {
    return Number(Math.random().toString().substr(2, 6));
  }
}
