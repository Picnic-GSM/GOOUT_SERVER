import * as nodemailer from "nodemailer";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Student } from "src/user/entites/student.entity";
import { StudentDataService } from "src/user/user.service";
import { RedisService } from "./redis";

export class SendEmail {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly redisService: RedisService
  ) {}

  async sendMail(id: number) {
    const userEmail = await this.studentDataService.findOneWithId(id);
    let authNum = await this.makeAuthCode();
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
        to: userEmail.email,
        subject: "Go-Out 회원가입 E-Mail인증번호",
        text: `인증번호는 ${authNum}입니다.`,
      };
      try {
        await smtpTransport.sendMail(mailOptions);
      } catch (error) {
        throw new HttpException("Check Email please", HttpStatus.BAD_REQUEST);
      }
      this.redisService.addData(id, authNum.toString(), 180);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "이메일 전송 에러",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async makeAuthCode() {
    return Number(Math.random().toString().substr(2, 6));
  }
}
