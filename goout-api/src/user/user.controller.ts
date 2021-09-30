import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Injectable,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { LoginReqDto } from "./dto/login.dto";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentDataService, TeacherDataService } from "./user.service";
import { LoginForTeacherDto } from "./dto/login-teacher.dto";
import { ActivateAccountDto } from "./dto/email-auth.dto";
import { validate } from "email-validator";
import { EmailDto } from "./dto/send-email.dto";
import * as nodemailer from "nodemailer";
import { RedisService } from "src/util/redis";

@Injectable()
export class InputValidator {
  constructor() {}
  // 학년 validator
  isValidGrade(grade: number): Boolean {
    if (!(1 <= grade && grade <= 3)) {
      return false;
    }
    return true;
  }
  // 학년 validator
  isValidClass(s_class: number): Boolean {
    if (!(1 <= s_class && s_class <= 4)) {
      return false;
    }
    return true;
  }

  // 번호 validator
  isValidNumber(s_number: number): Boolean {
    if (!(1 <= s_number && s_number <= 21)) {
      return;
    }
    return true;
  }
}

@ApiTags("로그인 API")
@Controller("login")
export class LoginController {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly authService: AuthService,
    private readonly teacherDataService: TeacherDataService,
    private readonly redisService: RedisService
  ) {}

  @ApiOperation({ summary: "학생 로그인", description: "학생 로그인" })
  @Post()
  @ApiCreatedResponse({ description: "로그인 성공 후 access token 발급 완료" })
  @ApiBadRequestResponse({ description: "입력된 데이터가 일치하지 않을 경우" })
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
    const isActive = await this.studentDataService.isActive(studentObj.idx);
    if (!isActive) {
      throw new HttpException(
        "비활성화된 게정입니다. 계정 활성화 후 사용해주세요.",
        HttpStatus.FORBIDDEN
      );
    }
    const accessToken = await this.authService.issueToken(studentObj);
    await this.redisService.addData(
      studentObj.idx,
      accessToken,
      60 * 60 * 24 * 3 // 학생의 로그인 토큰 만료시간 : 3일
    );
    return { accessToken: accessToken };
  }

  @Post("teacher")
  @ApiCreatedResponse({ description: "로그인 성공 후 access token 발급 완료" })
  @ApiBadRequestResponse({ description: "입력된 코드가 존재하지 않을 경우" })
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
    return {
      accessToken: await this.authService.issueTokenForTeacher(teacherObj),
    };
  }
}

@ApiTags("학생 데이터 API")
@Controller("student")
export class StudentController {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly inputValidator: InputValidator,
    private readonly redisService: RedisService
  ) {}

  @ApiOperation({ summary: "회원가입", description: "학생 회원가입" })
  @Post("register")
  @ApiCreatedResponse({ description: "회원가입 성공" })
  @ApiBadRequestResponse({
    description: "이메일 형식 오류 or 이메일 중복 오류 or 학년, 반, 번호 오류",
  })
  async register(@Body() req: CreateStudentDto) {
    if (!validate(req.email)) {
      throw new HttpException(
        "잘못된 이메일입니다. 다시 입력해주세요.",
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      !(
        this.inputValidator.isValidClass(req.class) &&
        this.inputValidator.isValidGrade(req.grade) &&
        this.inputValidator.isValidNumber(req.s_number)
      )
    ) {
      throw new HttpException(
        "grade는 1~3, class는 1~4, number는 1~21 내에서 입력해주세요.",
        HttpStatus.BAD_REQUEST
      );
    }

    const studentObj = await this.studentDataService.findOneWithEmail(
      req.email
    );
    if (studentObj) {
      throw new HttpException(
        "이미 존재하는 이메일니다.",
        HttpStatus.BAD_REQUEST
      );
    }
    return { data: await this.studentDataService.create(req) };
  }

  // 인덱스를 활용한 학생 데이터 조회
  @ApiOperation({
    summary: "인덱스를 활용한 학생 데이터 조회",
    description: "인덱스를 활용한 학생 데이터 조회",
  })
  @ApiOkResponse()
  @ApiNoContentResponse({ description: "일치하는 정보가 없을 경우" })
  @Get("/:id")
  async findWithId(@Param("id") id: number) {
    return { data: await this.studentDataService.findOneWithId(id) };
  }

  // 학년별 학생 데이터 조회
  @ApiOperation({
    summary: "학년별 학생 데이터 조회",
    description: "학년별 학생 데이터 조회",
  })
  @ApiOkResponse()
  @ApiNoContentResponse({ description: "일치하는 정보가 없을 경우" })
  @ApiBadRequestResponse({ description: "학년 범위 오류" })
  @Get("/grade/:grade")
  async findWithGrade(@Param("grade") grade: number) {
    if (!this.inputValidator.isValidGrade(grade)) {
      throw new HttpException(
        "1~4 중 하나를 입력해주십시오.",
        HttpStatus.BAD_REQUEST
      );
    }
    return { data: await this.studentDataService.findAllWithGrade(grade) };
  }

  // 이메일을 활용한 학생 데이터 조회
  @ApiOperation({
    summary: "이메일을 활용한 학생 데이터 조회",
    description: "이메일을 활용한 학생 데이터 조회",
  })
  @ApiOkResponse()
  @ApiNoContentResponse({ description: "해당 이메일로 가입된 정보 없음" })
  @ApiBadRequestResponse({ description: "존재하지 않은 이메일" })
  @Get("email/:email")
  async findWithEmail(@Param("email") email: string) {
    if (!validate(email)) {
      throw new HttpException(
        "잘못된 이메일 형식입니다. 다시 입력해주세요.",
        HttpStatus.BAD_REQUEST
      );
    }
    return { data: await this.studentDataService.findOneWithEmail(email) };
  }

  // 반별 학생 데이터 조회
  @ApiOperation({
    summary: "반별 학생 데이터 조회",
    description: "반별 학생 데이터 조회",
  })
  @ApiOkResponse()
  @ApiNoContentResponse({ description: "일치하는 정보가 없을 경우" })
  @ApiBadRequestResponse({ description: "학년, 반 범위 오류" })
  @Get("/class/:grade/:class")
  async findWithGradeAndClass(
    @Param("grade") grade: number,
    @Param("class") s_class: number
  ) {
    if (
      !(
        this.inputValidator.isValidGrade(grade) &&
        this.inputValidator.isValidClass(s_class)
      )
    ) {
      throw new HttpException(
        "grade는 1~4, class는 1~21 내에서 입력해주십시오.",
        HttpStatus.BAD_REQUEST
      );
    }
    return {
      data: await this.studentDataService.findAllWithGradeAndClass(
        grade,
        s_class
      ),
    };
  }

  // 모든 학생 데이터 조회
  @ApiOperation({
    summary: " 모든 학생 데이터 조회",
    description: " 모든 학생 데이터 조회",
  })
  @ApiOkResponse()
  @ApiNoContentResponse({ description: "일치하는 정보가 없을 경우" })
  @Get()
  async findAll() {
    return { data: await this.studentDataService.findAll() };
  }

  // 이메일 인증코드 보내기
  @ApiOperation({
    summary: "이메일 인증코드 보내기",
    description: "이메일 인증코드 보내기",
  })
  @Post("mail")
  @ApiOkResponse({ description: "인증코드 발송 성공" })
  @ApiBadRequestResponse({
    description: "이메일 형식 오류 or 존재하지 않는 이메일",
  })
  @ApiInternalServerErrorResponse({ description: "이메일 전송 실패" })
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
      this.redisService.addData(studentObj.idx, authNum.toString(), 1800);
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
  @ApiCreatedResponse({ description: "계정 활성화 성공" })
  @ApiBadRequestResponse({ description: "잚못된 인증코드" })
  async activateAccount(@Body() req: ActivateAccountDto) {
    const authCode = await this.redisService.getData(req.id);
    if (+authCode != req.authCode)
      throw new HttpException(
        "인증코드가 잘못됐거나 만료됐습니다.",
        HttpStatus.BAD_REQUEST
      );
    this.redisService.deleteData(req.id);
    return { data: await this.studentDataService.activateAccount(req.id) };
  }
}

@ApiTags("선생님 데이터 API")
@Controller("teacher")
export class TeacherController {
  constructor(
    private readonly teacherdataservice: TeacherDataService,
    private readonly inputValidator: InputValidator
  ) {}

  @Get("grade/:grade")
  @ApiOkResponse()
  @ApiNoContentResponse({ description: "일치하는 정보가 없을 경우" })
  @ApiBadRequestResponse({ description: "학년 범위 오류" })
  @ApiOperation({
    summary: "특정 학년 선생님 출력",
    description: "특정 학년 선생님 찾기",
  })
  async findTeacherWithGrade(@Param("grade") grade: number) {
    if (!this.inputValidator.isValidGrade) {
      throw new HttpException("학년 범위 오류", HttpStatus.BAD_REQUEST);
    }
    return { data: await this.teacherdataservice.findAllWithGrade(grade) };
  }

  @Get("class/:grade/:class")
  @ApiOkResponse()
  @ApiNoContentResponse({ description: "일치하는 정보가 없을 경우" })
  @ApiBadRequestResponse({ description: "학년, 반 범위 오류" })
  @ApiOperation({
    summary: "특정 학년 및 반 선생님 출력",
    description: "특정 학년과 반을 입력받아 선생님 찾기",
  })
  async findTeacherWithGradeAndClass(
    @Param("grade") grade: number,
    @Param("class") s_class: number
  ) {
    if (
      !(
        this.inputValidator.isValidGrade(grade) &&
        this.inputValidator.isValidClass(s_class)
      )
    ) {
      throw new HttpException(
        "grade는 1~4, class는 1~21 내에서 입력해주십시오.",
        HttpStatus.BAD_REQUEST
      );
    }
    return {
      data: await this.teacherdataservice.findOneWithGradeAndClass(
        grade,
        s_class
      ),
    };
  }
}
