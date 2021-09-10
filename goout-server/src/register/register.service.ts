import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDataDto } from 'src/userdata/register.interface';
import { UserdataService } from 'src/userdata/userdata.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class RegisterService {
    constructor(private readonly userdataservice:UserdataService) {}

    async send_AuthNum(req:RegisterDataDto) {
        try {
            let authNum = Math.random().toString().substr(2,6);

            const smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.NODEMAILER_USER,
                    pass: process.env.NODEMAILER_PASS
                }
            });

            const mailOptions = {
                from:process.env.NODEMAILER_USER,
                to:req.email,
                subject:"Go-Out 회원가입 E-Mail인증번호",
                text:`인증번호는 ${authNum}입니다.`
            };
            await this.userdataservice.createUserdata(req);
        } catch (error) {
            console.log(error);
            throw new HttpException("이메일 전송 에러",HttpStatus.CONFLICT)
        }
        
    }
}