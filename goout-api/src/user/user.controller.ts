import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
// import { RedisService } from "src/util/redis";
import { EmailAuthDto } from "./dto/email-auth.dto";
import { LoginDataDto } from "./dto/login.dto";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentDataService, TeacherDataService } from "./user.service";
import { ActivateTeacherDto } from "./dto/activate-teacher.dto";

@ApiTags("유저 라우터")
@Controller("user")
export class UserController {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly authservice: AuthService,
    private readonly teacherdataservice: TeacherDataService
  ) {}

  @ApiOperation({ summary: "로그인", description: "선생님과 학생의 로그인" })
  @Post()
  @HttpCode(201)
  async login(@Body() req: LoginDataDto) {
    let user = await this.studentDataService.findOneWithEmail(req.email);
    console.log(user);
    if (user == undefined) {
      throw new HttpException(
        "아이디를 찾을 수 없습니다",
        HttpStatus.BAD_REQUEST
      );
    }
    /*
    const decipher = crypto.createDecipher("aes-256-cbc", process.env.key);
    let result = decipher.update(user.password, "base64", "utf8");
    result += decipher.final("utf8");
    console.log(result, req.password);
    
    if (result == req.password) {
      return this.authservice.issueToken(user);
    } else {
      throw new HttpException(
        "비밀번호가 잘못 됐습니다",
        HttpStatus.BAD_REQUEST
      );
    }
    */
  }

  @ApiTags("선생님용 라우터")
  @Post("teacher")
  @HttpCode(201)
  @ApiOperation({ summary: "선생님 로그인", description: "코드로 로그인" })
  async Code_Login(@Body() req: ActivateTeacherDto) {
    let teacherObj = await this.teacherdataservice.findOneWithActivateCode(
      req.activateCode
    );
    if(teacherObj.is_active == false) teacherObj.is_active = true;
    return await this.authservice.issueTokenForTeacher(teacherObj);
  }
}


@Controller("student")
export class StudentController {
  constructor(
    private readonly studentDataService: StudentDataService,
    // private readonly redisService: RedisService
  ) {}
  @ApiTags('학생용 라우터')
  @ApiOperation({ summary: "회원가입", description: "학생 회원가입" })
  @Post("register")
  @HttpCode(201)
  async register(@Body() req: CreateStudentDto) {
    let exist = await this.studentDataService.findOneWithEmail(req.email);
    if (exist != undefined) {
      console.log(exist);
      throw new HttpException(
        "이메일이 이미 존재합니다",
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      await this.studentDataService.create(req);
      return "회원가입 성공";
    } catch (error) {
      console.log(error);
      throw new HttpException("회원가입 에러", HttpStatus.BAD_REQUEST);
    }
  }
/*
  @Post("activate")
  async authNumCheck(@Body() req: EmailAuthDto) {
    let authCode = await this.redisService.get_redis(req.userId);
    if (Number(authCode) == req.authCode) {
      // db값 수정하는 코드
      return "인증완료됐습니다.";
    } else {
      throw new HttpException(
        "인증코드가 잘못됐거나 만료됐습니다.",
        HttpStatus.BAD_REQUEST
      );
    }
  }
  */
}

@Controller("teacher")
export class TeacherController {}
