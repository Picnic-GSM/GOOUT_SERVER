import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { LoginReqDto } from "./dto/login.dto";
import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentDataService, TeacherDataService } from "./user.service";
import { LoginForTeacherDto } from "./dto/login-teacher.dto";

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
    return { accessToken: this.authService.issueToken(studentObj) };
  }

  @Post("teacher")
  @HttpCode(201)
  @ApiOperation({
    summary: "선생님 로그인",
    description: "지급된 코드를 활용한 로그인",
  })
  async logForTeacher(@Body() req: LoginForTeacherDto) {
    let teacherObj = await this.teacherDataService.findOneWithActivateCode(
      req.code
    );
    return await this.authService.issueTokenForTeacher(teacherObj);
  }
}

@ApiTags("학생 데이터 API")
@Controller()
export class StudentController {
  constructor(private readonly studentDataService: StudentDataService) {}

  @ApiOperation({ summary: "회원가입", description: "학생 회원가입" })
  @Post("register")
  @HttpCode(201)
  async register(@Body() req: CreateStudentDto) {
    const exist = await this.studentDataService.findOneWithEmail(req.email);
    if (exist) {
      throw new HttpException(
        "이미 존재하는 이메일니다.",
        HttpStatus.BAD_REQUEST
      );
    }
    return await this.studentDataService.create(req);
  }

  // @Post("activate")
  // async activateStudentAccount(@Body() req: EmailAuthDto) {
  //   const authCode = await this.redisService.get_redis(req.id);
  //   if (Number(authCode) == req.authCode) {
  //     return "인증완료됐습니다.";
  //   } else {
  //     throw new HttpException(
  //       "인증코드가 잘못됐거나 만료됐습니다.",
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  // }

  // 인덱스를 활용한 학생 데이터 조회
  @Get("/:id")
  async findWithId(@Param("id") studentId: number) {
    return await this.studentDataService.findOneWithId(studentId);
  }

  // 이메일을 활용한 학생 데이터 조회
  @Get()
  async findWithEmail(@Query("email") studentEmail: string) {
    const studentObj = await this.studentDataService.findOneWithEmail(
      studentEmail
    );
    if (!studentObj) {
      throw new HttpException(
        "존재하지 않는 이메일입니다.",
        HttpStatus.BAD_REQUEST
      );
    }
    return studentObj;
  }

  // 학년별 학생 데이터 조회
  @Get()
  async findWithGrade(@Query("grade") grade: number) {
    const studentsObj = await this.studentDataService.findAllWithGrade(grade);
    if (!studentsObj) {
      throw new HttpException(
        "1~4 중 하나를 입력해주십시오.",
        HttpStatus.BAD_REQUEST
      );
    }
    return studentsObj;
  }
  // 반별 학생 데이터 조회
  // 모든 학생 데이터 조회
  // 이메일 인증코드 보내기
  // 이메일 인증을 통한 계정 활성화
}

@Controller("teacher")
export class TeacherController {}
