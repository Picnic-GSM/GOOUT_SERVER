import { Get, HttpCode, HttpStatus } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { Body, Controller, Headers, Post } from "@nestjs/common";
import { jwtConstants } from "src/auth/constants";
import { CreateOutDataDto } from "src/out/dto/create-out.dto";
import { OutDataService } from "src/out/out.service";
import { StudentDataService } from "src/user/user.service";
import * as jwt from "jsonwebtoken";
import { Out } from "src/out/entities/out.entity";
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
import { AuthService } from "src/auth/auth.service";
import { CheckOutRequestDto } from "./dto/check-out-request.dto";
import { decode } from "punycode";
import { OutBackCheckDto } from "./dto/out-back-check.dto";

@Controller("out")
export class OutController {
  constructor(
    private readonly studentDataService: StudentDataService,
    private readonly outService: OutDataService,
    private readonly authService: AuthService
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
  async getOutData(@Headers("accessToken") accessToken) {
    await this.authService.validator(accessToken);

    let alldata = await this.outService.getData(); //1차 값 가져오기
    await this.outService.check_status(alldata); //값 확인 후 지각인지 확인
    let after_check = await this.outService.getData(); //확인된 값을 다시 받아옴
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
    await this.authService.validator(accessToken);

    let onedata = await this.outService.findwithclass(1);
    await this.outService.check_status(onedata);
    onedata = await this.outService.findwithclass(1);
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
    await this.authService.validator(accessToken);

    let twodata = await this.outService.findwithclass(2);
    await this.outService.check_status(twodata);
    twodata = await this.outService.findwithclass(2);
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
    await this.authService.validator(accessToken);

    let threedata = await this.outService.findwithclass(3);
    await this.outService.check_status(threedata);
    threedata = await this.outService.findwithclass(3);
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
    await this.authService.validator(accessToken);

    let result = this.outService.find_with_request_check(1);
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
    @Body() req: CheckOutRequestDto
  ) {
    await this.authService.validator(accessToken);

    await this.outService.update_GoingRequestdata(req.id, req.response);
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
    @Body() req: CreateOutDataDto
  ) {
    await this.authService.validator(accessToken);

    let decoded = jwt.verify(accessToken, jwtConstants.secret);
    //let userdata = await this.studentDataService.findOneWithId(decoded["userid"]);
    req.user_id = await decoded["userid"];
    try {
      await this.outService.create(req);
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
    @Body() req: OutBackCheckDto
  ) {
    await this.authService.validator(accessToken);

    await this.outService.updateGoingdata(req.id, 4);
    return "실행됐습니다.";
  }
}
