import { Body, HttpCode } from "@nestjs/common";
import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterDataDto } from "src/userdata/register.interface";
import { UserdataService } from "src/userdata/userdata.service";
import { RegisterAuthNumCheck } from "./registerAuth.interface";
import * as nodemailer from 'nodemailer'
import { RegisterService } from "./register.service";

@ApiTags("학생용 라우터")
@Controller("register")
export class RegisterController {
  constructor(private readonly userdataservice: UserdataService,private readonly registerservice:RegisterService) {}

  @ApiOperation({ summary: "회원가입", description: "학생,선생님의 회원가입" })
  @Post()
  @HttpCode(201)
  async register(@Body() req: RegisterDataDto) {
    let exist = await this.userdataservice.findwithEmail(req.email);
    if (exist != undefined) {
      console.log(exist);
      throw new HttpException(
        "이메일이 이미 존재합니다",
        HttpStatus.BAD_REQUEST
      );
      
        
    } else {
      await this.registerservice.send_AuthNum(req)
      return "이메일 인증 후 로그인이 가능합니다.";
    }
  }

  @Post("Check")
  async authNumCheck(@Body() req: RegisterAuthNumCheck) {
    let user = await this.userdataservice.findOnewithUserid(req.userid);
  }
}
