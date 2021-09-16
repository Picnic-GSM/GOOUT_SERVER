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
import { EmailAuthDto } from "./dto/email-auth.dto";
import { LoginDataDto } from "./dto/login.dto";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentDataService, TeacherDataService, UserService } from "./user.service";
import { ActivateTeacherDto } from "./dto/activate-teacher.dto";
import { jwtConstants } from "src/auth/constants";
import { findTeacherWithGrade } from "./dto/find-teacher-with-grade.dto";
import { FindTeacherWithGradeNClass } from "./dto/find-teacher-with-grade-class.dto";
import { RedisService } from "src/util/redis";
import { SendEmail } from "src/util/mail";
import * as nodemailer from "nodemailer";

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
    */
   let result = user.password //암호화 생략
    if (result == req.password) {
      return this.authservice.issueToken(user);
    } else {
      throw new HttpException(
        "비밀번호가 잘못 됐습니다",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

@Controller("student")
export class StudentController {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly redisService: RedisService,
    private readonly userService:UserService
  ) {}
  @ApiTags("학생용 라우터")
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
    let createdResult = await this.studentDataService.create(req);
    this.userService.sendMail(createdResult.email,createdResult.id)
    try {
      let createdResult = await this.studentDataService.create(req);
      console.log(createdResult.id);
      const userEmail = await this.studentDataService.findOne(createdResult.id);
      console.log(userEmail);
      let authNum = await Number(Math.random().toString().substr(2, 6));

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
      
      await smtpTransport.sendMail(mailOptions, (err) => {
        if(err) console.log(err)
      });
      console.log("인증번호:" + authNum);
      this.redisService.add_redis(createdResult.id, authNum, 180);
      return "회원가입 성공";
    } catch (error) {
      console.log(error);
      throw new HttpException("이메일 전송 에러", HttpStatus.CONFLICT);
    }
  }
  @Post("activate")
  async authNumCheck(@Body() req: EmailAuthDto) {
    let authCode = await this.redisService.get_redis(req.userId);
    if (Number(authCode) == req.authCode) {
      this.studentDataService.Activating(req.userId);
      return "인증완료됐습니다.";
    } else {
      throw new HttpException(
        "인증코드가 잘못됐거나 만료됐습니다.",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

@ApiTags("선생님용 라우터")
@Controller("teacher")
export class TeacherController {
  constructor(
    private readonly teacherdataservice: TeacherDataService,
    private readonly authservice: AuthService
  ) {}

  @Post("login")
  @HttpCode(201)
  @ApiOperation({ summary: "선생님 로그인", description: "코드로 로그인" })
  async Code_Login(@Body() req: ActivateTeacherDto) {
    let teacherObj = await this.teacherdataservice.findOneWithActivateCode(
      req.activateCode
    );
    console.log(process.env.JWT_SECRET_KEY);

    if (teacherObj.is_active == false) teacherObj.is_active = true;
    return await this.authservice.issueTokenForTeacher(teacherObj);
  }
  @Post("showWithGrade")
  @HttpCode(201)
  @ApiOperation({
    summary: "특정 학년 선생님 출력",
    description: "특정 학년을 입력받아 선생님 찾기",
  })
  async findTeacherWithGrade(@Body() req: findTeacherWithGrade) {
    let teacherdata = await this.teacherdataservice.findOneWithGrade(req.grade);
    if (!teacherdata)
      throw new HttpException(
        "해당 학급 선생님을 찾을 수 없습니다.",
        HttpStatus.BAD_REQUEST
      );
    return teacherdata;
  }

  @Post("showWithGradeAndClass")
  @HttpCode(201)
  @ApiOperation({
    summary: "특정 학년 및 반 선생님 출력",
    description: "특정 학년과 반을 입력받아 선생님 찾기",
  })
  async findTeacherWithGradeAndClass(@Body() req: FindTeacherWithGradeNClass) {
    let teacherdata = await this.teacherdataservice.findOneWithGradeAndClass(
      req.grade,
      req.class
    );
    if (!teacherdata)
      throw new HttpException(
        "해당 선생님을 찾을 수 없습니다.",
        HttpStatus.BAD_REQUEST
      );
    return teacherdata;
  }
}
