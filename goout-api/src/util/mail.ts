import { StudentDataService } from "src/user/user.service";
import * as nodemailer from "nodemailer";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Student } from "src/user/entites/student.entity";

export class MailHandler {
  async send(obj: Student) {
    const authNum = await this.makeAuthCode();
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
        to: obj.email,
        subject: "Go-Out 회원가입 E-Mail인증번호",
        text: `인증번호는 ${authNum}입니다.`,
      };

      await smtpTransport.sendMail(mailOptions);
      // redis 모듈 추가
      // this.redisService.add_redis(studentObj.idx, authNum, 180);
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
