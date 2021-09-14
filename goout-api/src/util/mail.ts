import { EmailAuthDto } from "src/user/dto/email-auth.dto";
import { StudentDataService } from "src/user/user.service";
import { RedisService } from "./redis";
import * as nodemailer from "nodemailer";
import { HttpException, HttpStatus } from "@nestjs/common";

export class SendEmail {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly redisService: RedisService
  ) {}

  async sendMail(req: EmailAuthDto) {
    const userEmail = this.studentDataService.findOneWithId(req.userId);
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
        to: userEmail,
        subject: "Go-Out 회원가입 E-Mail인증번호",
        text: `인증번호는 ${authNum}입니다.`,
      };
      let created_data = await this.studentDataService.create(req);
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
