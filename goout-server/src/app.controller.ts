import { Controller, Get, Post,Headers, HttpStatus, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from './auth/constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiTags('개발용')
  @ApiOperation({description:'학생이면 0, 선생이면 1 반환',summary:'선생, 학생 구분 라우터'})
  @Get()
  async check_Role(@Headers() accessToken) {
      try {
        let decoded = jwt.verify(accessToken,jwtConstants.secret);
    } catch (error) {
        throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
    }
    let decoded = jwt.verify(accessToken,jwtConstants.secret);
    if(decoded['grade']) {
      return 1;
    } else {
      return 0;
    }
  }
}
