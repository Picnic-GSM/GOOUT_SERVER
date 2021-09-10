import { Get, HttpCode, HttpStatus } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { Body, Controller, Headers, Post } from "@nestjs/common";
import { jwtConstants } from "src/auth/constants";
import { CreateGoingDto } from "src/out/outdata.interface";
import { GoingoutDataService } from "src/out/outdata.service";
import { StudentService } from "src/student/userdata.service";
import * as jwt from "jsonwebtoken";
import { Out } from "src/out/outdata.entity";
import { GoingService } from "./going.service";
import * as crypto from "crypto";
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { GoingRequestCheckDto } from "./requestcheck.interface";
import { GoingOutCheckDto } from "./outcheck.interface";
import { AuthService } from "src/auth/auth.service";

@Controller("going")
export class GoingController {
  constructor(
    private readonly userdataservice: StudentService,
    private readonly goingoutservice: GoingoutDataService,
    private readonly goingservice: GoingService,
    private readonly authservice: AuthService
  ) {}

  @ApiTags("공용 라우터")
  @Get()
  @HttpCode(200)
  @ApiResponse({
    description: "조퇴한 모든 학생을 출력",
    type: Out,
    isArray: true,
    status: 200,
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  @ApiOperation({
    summary: "외출한 학생 모두 출력",
    description: "외출 정보를 반환",
  })
  async get_goingoutdata(@Headers("accessToken") accessToken) {
    await this.authservice.JWTverify(accessToken);

    let alldata = await this.goingoutservice.getData(); //1차 값 가져오기
    await this.goingservice.check_status(alldata); //값 확인 후 지각인지 확인
    let after_check = await this.goingoutservice.getData(); //확인된 값을 다시 받아옴
    if (!alldata) {
      // throw or ?
    }
    return await after_check;
  }

  @ApiTags("공용 라우터")
  @Get("one")
  @HttpCode(200)
  @ApiResponse({
    description: "외출한 1학년 출력",
    type: Out,
    isArray: true,
    status: 200,
  })
  @ApiOperation({
    summary: "1학년 외출 학생만 출력",
    description: "외출 정보를 반환",
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  async get_first_goingoutdata(@Headers("accessToken") accessToken) {
    await this.authservice.JWTverify(accessToken);

    let onedata = await this.goingoutservice.findwithclass(1);
    await this.goingservice.check_status(onedata);
    onedata = await this.goingoutservice.findwithclass(1);
    return onedata;
  }

  @ApiTags("공용 라우터")
  @Get("two")
  @ApiResponse({
    description: "외출한 2학년 출력",
    type: Out,
    isArray: true,
    status: 200,
  })
  @HttpCode(200)
  @ApiOperation({
    summary: "2학년 외출 학생만 출력",
    description: "외출 정보를 반환",
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  async get_second_goingoutdata(@Headers("accessToken") accessToken) {
    await this.authservice.JWTverify(accessToken);

    let twodata = await this.goingoutservice.findwithclass(2);
    await this.goingservice.check_status(twodata);
    twodata = await this.goingoutservice.findwithclass(2);
    return twodata;
  }

  @ApiTags("공용 라우터")
  @Get("three")
  @ApiResponse({
    description: "외출한 3학년 출력",
    type: Out,
    isArray: true,
    status: 200,
  })
  @HttpCode(200)
  @ApiOperation({
    summary: "3학년 외출 학생만 출력",
    description: "외출 정보를 반환",
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  async get_third_goingoutdata(@Headers("accessToken") accessToken) {
    await this.authservice.JWTverify(accessToken);

    let threedata = await this.goingoutservice.findwithclass(3);
    await this.goingservice.check_status(threedata);
    threedata = await this.goingoutservice.findwithclass(3);
    return threedata;
  }

  @ApiTags("선생님용 라우터")
  @Get("request-check")
  @HttpCode(200)
  @ApiResponse({
    description: "승인 되지 않은 외출 정보들 출력",
    type: Out,
    isArray: true,
    status: 200,
  })
  @ApiOperation({
    summary: "승인 되지 않은 외출 정보만 출력",
    description: "선생님의 승인창",
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  async get_request_check(@Headers("accessToken") accessToken) {
    await this.authservice.JWTverify(accessToken);

    let result = this.goingoutservice.find_with_request_check("미승인");
    return result;
  }

  @ApiTags("선생님용 라우터")
  @Post("request-check")
  @HttpCode(201)
  @ApiResponse({ status: 201 })
  @ApiOperation({
    summary: "외출을 승인시켜주는 창",
    description: "선생님이 승인할 때 사용됨",
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  async post_request_check(
    @Headers("accessToken") accessToken,
    @Body() req: GoingRequestCheckDto
  ) {
    await this.authservice.JWTverify(accessToken);

    await this.goingoutservice.update_GoingRequestdata(req.id, "승인");
    return "승인되었습니다.";
  }

  @ApiTags("학생용 라우터")
  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201 })
  @ApiOperation({
    summary: "외출을 요청",
    description: "학생들이 외출을 요청시켜줌",
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  async create_going(
    @Headers("accessToken") accessToken,
    @Body() req: CreateGoingDto
  ) {
    await this.authservice.JWTverify(accessToken);

    let decoded = jwt.verify(accessToken, jwtConstants.secret);
    let userdata = await this.userdataservice.findOne(decoded["userid"]);
    req.status = "미승인";
    try {
      await this.goingoutservice.createGoingout(req);
      return "신청되었습니다.";
    } catch (error) {
      console.log(error);
      throw new HttpException(
        "생성 중 에러 발생. 다시 시도해주세요",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @ApiTags("선생님용 라우터")
  @Post("out-check")
  @ApiResponse({ status: 201 })
  @HttpCode(201)
  @ApiOperation({
    summary: "외출 귀가 완료창",
    description: "선생님이 귀가 확인시 사용",
  })
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  async out_check(
    @Headers("accessToken") accessToken,
    @Body() req: GoingOutCheckDto
  ) {
    await this.authservice.JWTverify(accessToken);

    await this.goingoutservice.updateGoingdata(req.id, "귀가완료");
    return "실행됐습니다.";
  }
}
