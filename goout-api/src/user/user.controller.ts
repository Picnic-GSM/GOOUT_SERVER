import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { LoginReqDto } from "./dto/login.dto";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentDataService, TeacherDataService } from "./user.service";
import { LoginForTeacherDto } from "./dto/login-teacher.dto";
import { MailHandler } from "src/util/mailHandler";
import { ActivateAccountDto } from "./dto/email-auth.dto";
import { FindWithGradeDto } from "./dto/find-with-grade.dto";
import { validate } from "email-validator";
import { EmailDto } from "./dto/send-email.dto";
import { FindWithGradeAndClassDto } from "./dto/find-with-grade-class.dto";
import * as nodemailer from "nodemailer";

@ApiTags("로그인 API")
@Controller("login")
export class LoginController {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly authService: AuthService,
    private readonly teacherDataService: TeacherDataService
  ) {}

  @ApiOperation({ summary: "학생 로그인", description: "학생 로그인" })
  @Post()
  @HttpCode(201)
  async login(@Body() req: LoginReqDto) {
    const studentObj = await this.studentDataService.validator(
      req.email,
      req.password
    );
    if (!studentObj) {
      throw new HttpException(
        "일치하지 않은 정보입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    return await { accessToken: this.authService.issueToken(studentObj) };
  }

  @Post("teacher")
  @HttpCode(201)
  @ApiOperation({
    summary: "선생님 로그인",
    description: "지급된 코드를 활용한 로그인",
  })
  async loginForTeacher(@Body() req: LoginForTeacherDto) {
    let teacherObj = await this.teacherDataService.findOneWithActivateCode(
      req.code
    );
    if (!teacherObj)
      throw new HttpException(
        "일치하는 코드가 업습니다.",
        HttpStatus.BAD_REQUEST
      );
    if (!teacherObj.is_active) teacherObj.is_active = true;
    return await this.authService.issueTokenForTeacher(teacherObj);
  }
}

@ApiTags("학생 데이터 API")
@Controller("student")
export class StudentController {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly mailHandler: MailHandler
  ) {}

  @ApiOperation({ summary: "회원가입", description: "학생 회원가입" })
  @Post("register")
  @HttpCode(201)
  async register(@Body() req: CreateStudentDto) {
    if (!validate(req.email)) {
      throw new HttpException(
        "잘못된 이메일입니다. 다시 입력하여주세요.",
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      !(
        this.studentDataService.isValidClass(req.class) &&
        this.studentDataService.isValidGrade(req.grade) &&
        this.studentDataService.isValidNumber(req.s_number)
      )
    ) {
      throw new HttpException(
        "grade는 1~3, class는 1~4, number는 1~21 내에서 입력해주십시오.",
        HttpStatus.BAD_REQUEST
      );
    }

    const exist = await this.studentDataService.findOneWithEmail(req.email);
    if (exist) {
      throw new HttpException(
        "이미 존재하는 이메일니다.",
        HttpStatus.BAD_REQUEST
      );
    }
    return await this.studentDataService.create(req);
  }

  // 인덱스를 활용한 학생 데이터 조회
  @ApiOperation({
    summary: "인덱스를 활용한 학생 데이터 조회",
    description: "인덱스를 활용한 학생 데이터 조회",
  })
  @Get("/:id")
  async findWithId(@Param("id") id: number) {
    return await this.studentDataService.findOneWithId(id);
  }

  // 학년별 학생 데이터 조회
  @ApiOperation({
    summary: "학년별 학생 데이터 조회",
    description: "학년별 학생 데이터 조회",
  })
  @Get("/grade/:grade")
  async findWithGrade(@Param("grade") grade: number) {
    const studentsObj = await this.studentDataService.findAllWithGrade(grade);
    if (!studentsObj) {
      throw new HttpException(
        "1~4 중 하나를 입력해주십시오.",
        HttpStatus.BAD_REQUEST
      );
    }
    return studentsObj;
  }

  // 이메일을 활용한 학생 데이터 조회
  @ApiOperation({
    summary: " 이메일을 활용한 학생 데이터 조회",
    description: "이메일을 활용한 학생 데이터 조회",
  })
  @Get("email/:email")
  async findWithEmail(@Param("email") email: string) {
    const studentObj = await this.studentDataService.findOneWithEmail(email);
    if (!studentObj) {
      throw new HttpException(
        "존재하지 않는 이메일입니다.",
        HttpStatus.BAD_REQUEST
      );
    }
    return studentObj;
  }

  // 반별 학생 데이터 조회
  @ApiOperation({
    summary: "반별 학생 데이터 조회",
    description: "반별 학생 데이터 조회",
  })
  @Get("/class/:grade/:class")
  async findWithGradeAndClass(
    @Query("grade") grade: number,
    @Query("class") s_class: number
  ) {
    const studentsObj = await this.studentDataService.findAllWithGradeAndClass(
      grade,
      s_class
    );
    if (!studentsObj) {
      throw new HttpException(
        "grade는 1~4, class는 1~21 내에서 입력해주십시오.",
        HttpStatus.BAD_REQUEST
      );
    }
    return studentsObj;
  }

  // 모든 학생 데이터 조회
  @ApiOperation({
    summary: " 모든 학생 데이터 조회",
    description: " 모든 학생 데이터 조회",
  })
  @Get()
  async findAll() {
    return await this.studentDataService.findAll();
  }

  // 이메일 인증코드 보내기
  @ApiOperation({
    summary: "이메일 인증코드 보내기",
    description: "이메일 인증코드 보내기",
  })
  @Post("mail")
  @HttpCode(200)
  async sendAuthCode(@Body() req: EmailDto) {
    if (!validate(req.email)) {
      throw new HttpException(
        "이메일 형식이 맞지 않습니다.",
        HttpStatus.BAD_REQUEST
      );
    }
    const studentObj = await this.studentDataService.findOneWithEmail(
      req.email
    );
    if (!studentObj) {
      throw new HttpException(
        "가입되지 않은 이메일입니다.",
        HttpStatus.BAD_REQUEST
      );
    }
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
        to: studentObj.email,
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
    return { message: "success" };
  }
  // 계정활성화 이메일 인증코드 생성
  async makeAuthCode() {
    return Number(Math.random().toString().substr(2, 6));
  }

  // 이메일에 전송된 인증코드를 통한 계정 활성화
  @ApiOperation({
    summary: "이메일에 전송된 인증코드를 통한 계정 활성화",
    description: "이메일에 전송된 인증코드를 통한 계정 활성화",
  })
  @Patch("activate")
  async activateAccount(@Body() req: ActivateAccountDto) {
    // redis에서 해당 id의 authCode 가져오기
    // const authCode = await this.redisService.get_redis(req.id);
    // if (+authCode == req.authCode) {
    //   return "인증완료됐습니다.";
    // } else {
    //   throw new HttpException(
    //     "인증코드가 잘못됐거나 만료됐습니다.",
    //     HttpStatus.BAD_REQUEST
    //   );
    // }
    const studentObj = await this.studentDataService.activateAccount(req.id);
    return studentObj;
  }
}

@ApiTags("선생님 데이터 API")
@Controller("teacher")
export class TeacherController {
  constructor(
    private readonly teacherdataservice: TeacherDataService,
    private readonly authservice: AuthService
  ) {}

  @Post("login")
  @HttpCode(201)
  @ApiOperation({ summary: "선생님 로그인", description: "코드로 로그인" })
  async Code_Login(@Body() req: LoginForTeacherDto) {
    let teacherObj = await this.teacherdataservice.findOneWithActivateCode(
      req.code
    );

    if (teacherObj.is_active == false) teacherObj.is_active = true;
    return await this.authservice.issueTokenForTeacher(teacherObj);
  }

  @Post("showWithGrade")
  @HttpCode(201)
  @ApiOperation({
    summary: "특정 학년 선생님 출력",
    description: "특정 학년 선생님 찾기",
  })
  async findTeacherWithGrade(@Body() req: FindWithGradeDto) {
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
  async findTeacherWithGradeAndClass(@Body() req: FindWithGradeAndClassDto) {
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
