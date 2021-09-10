import {
  Controller,
  Get,
  Post,
  Headers,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { AppService } from "./app.service";
import * as jwt from "jsonwebtoken";
import { jwtConstants } from "./auth/constants";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";
import { RedisService } from "./util/redis.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisservice: RedisService
  ) {}
  @ApiTags("개발용")
  @ApiHeader({ name: "accessToken", description: "Input JWT" })
  @ApiOperation({
    description: "학생이면 0, 선생이면 1 반환",
    summary: "선생, 학생 구분 라우터",
  })
  @Get()
  async check_Role(@Headers("accessToken") accessToken) {
    try {
      let decoded = jwt.verify(accessToken, jwtConstants.secret);
    } catch (error) {
      throw new HttpException("token is expired", HttpStatus.UNAUTHORIZED);
    }
    let decoded = jwt.verify(accessToken, jwtConstants.secret);
    if (decoded["grade"]) {
      return 1;
    } else {
      return 0;
    }
  }
  @Get("redis-test")
  async redis_test() {
    return await this.redisservice.get_redis("key");
  }
}
