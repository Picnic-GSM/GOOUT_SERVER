import { Body, HttpCode } from "@nestjs/common";
import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterDataDto } from "src/student/register.interface";
import { StudentService } from "src/student/userdata.service";
import { RegisterAuthNumCheck } from "./registerAuth.interface";
import { RegisterService } from "./register.service";
import { RedisService } from "src/util/redis.service";
import { authnumService } from "src/util/authnum.service";

@ApiTags("학생용 라우터")
@Controller("register")
export class RegisterController {
  constructor(
    private readonly userdataservice: StudentService,
    private readonly authnumservice:authnumService,
    private readonly redisservice:RedisService
  ) {}

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

  @Post("Auth-Check")
  async authNumCheck(@Body() req: RegisterAuthNumCheck) {
    let authnum = await this.redisservice.get_redis(req.userid);
    if(Number(authnum) == req.authNum) {
      // db값 수정하는 코드
      return "인증완료됐습니다."
    } else {
      throw new HttpException("인증코드가 잘못됐거나 만료됐습니다.",HttpStatus.BAD_REQUEST);
    }
  }
}
