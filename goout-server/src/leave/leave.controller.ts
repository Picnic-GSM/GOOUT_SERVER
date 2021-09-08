import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { CreateLeavedataDto } from "src/leavedata/leavedata.interface";
import * as jwt from "jsonwebtoken";
import { jwtConstants } from "src/auth/constants";
import { LeavedataService } from "src/leavedata/leavedata.service";

@Controller("leave")
export class LeaveController {
  constructor(private readonly leavedataservice: LeavedataService) {}

  @Post()
  async leave_request(
    @Headers("accessToken") accessToken,
    @Body() req: CreateLeavedataDto
  ) {
    try {
      let decoded = jwt.verify(accessToken, jwtConstants.secret);
    } catch (error) {
      throw new HttpException("token is expired", HttpStatus.BAD_REQUEST);
    }
    let decoded = jwt.verify(accessToken, jwtConstants.secret);
    let userdata = await this.leavedataservice.findOne(decoded["userid"]);
    req.username = userdata.username;
    req.grade = userdata.grade;
    req.class = userdata.class;
    req.s_number = userdata.s_number;
  }
}
