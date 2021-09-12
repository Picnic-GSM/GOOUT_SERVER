import { RegisterDataDto } from "src/userdata/register.interface";
import { UserdataService } from "src/userdata/userdata.service";
import { RedisService } from "./redis.service";
import * as nodemailer from "nodemailer";
import { HttpException, HttpStatus } from "@nestjs/common";

export class authnumService {
  constructor(
    private readonly userdataservice: UserdataService,
    private readonly redisservice: RedisService
  ) {}

  async send_AuthNum(req: RegisterDataDto) {
    try {
      let authNum = Number(Math.random().toString().substr(2, 6));

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
      let created_data = await this.userdataservice.createUserdata(req);
      this.redisservice.add_redis(created_data.userid, authNum, 180);
    } catch (error) {
      console.log(error);
      throw new HttpException("이메일 전송 에러", HttpStatus.CONFLICT);
    }
  }
}
