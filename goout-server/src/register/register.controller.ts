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

@ApiTags("학생용 라우터")
@Controller("register")
export class RegisterController {
  constructor(private readonly userdataservice: UserdataService) {}

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
    }
    try {
      await this.userdataservice.createUserdata(req);
      return "회원가입 성공";
    } catch (error) {
      console.log(error);
      throw new HttpException("회원가입 에러", HttpStatus.BAD_REQUEST);
    }
  }

  @Post("Check")
  async authNumCheck(@Body() req: RegisterAuthNumCheck) {
    let user = await this.userdataservice.findOnewithUserid(req.userid);
  }
}
