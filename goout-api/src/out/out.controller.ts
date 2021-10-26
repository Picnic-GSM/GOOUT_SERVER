import { Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateOutDataDto } from 'src/out/dto/create-out.dto';
import { OutDataService } from 'src/out/out.service';
import { Out } from 'src/out/entities/out.entity';
import {
    ApiCreatedResponse,
    ApiHeader,
    ApiNoContentResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { CheckOutRequestDto } from './dto/check-out-request.dto';
import { OutBackCheckDto } from './dto/out-back-check.dto';
import { StudentDataService } from 'src/user/user.service';

@Controller('out')
export class OutController {
    constructor(
        private readonly outService: OutDataService,
        private readonly authService: AuthService,
        private readonly studentService: StudentDataService,
    ) {}

    @ApiTags('공용 라우터')
    @Get()
    @HttpCode(200)
    @ApiNoContentResponse({ description: '일치하는 정보가 없습니다.' })
    @ApiResponse({
        description: '외출한 모든 학생을 출력',
        type: Out,
        isArray: true,
        status: 200,
    })
    @ApiHeader({ name: 'Authorization', description: 'Input accessToken' })
    @ApiOperation({
        summary: '모든 외출 정보 출력',
        description: '외출 정보를 반환',
    })
    async getOutData(@Headers('Authorization') accessToken) {
        await this.authService.validator(accessToken);

        let alldata = await this.outService.getData(); //1차 값 가져오기
        if (!alldata.length) {
            throw new HttpException(
                '일치하는 데이터가 없습니다.',
                HttpStatus.NO_CONTENT,
            );
        }
        await this.outService.checkStatus(alldata); //값 확인 후 지각인지 확인
        return this.outService.getData(); //확인된 값을 다시 받아옴
    }

    @ApiTags('공용 라우터')
    @Get('/:grade')
    @HttpCode(200)
    @ApiResponse({
        description: '학년별 외출한 학생들 출력',
        type: Out,
        isArray: true,
        status: 200,
    })
    @ApiOperation({
        summary: '학년별 외출한 학생 출력',
        description: '외출 정보를 반환',
    })
    @ApiHeader({ name: 'Authorization', description: 'Input accessToken' })
    async getOutDataWithGrade(
        @Headers('Authorization') accessToken,
        @Param('grade') grade: number,
    ) {
        await this.authService.validator(accessToken);

        let outObj = await this.outService.findWithGrade(grade);
        return this.outService.checkStatus(outObj);
    }

    @ApiTags('선생님용 라우터')
    @Get('request-check')
    @HttpCode(200)
    @ApiResponse({
        description: '승인 되지 않은 외출 정보들 출력',
        type: Out,
        isArray: true,
        status: 200,
    })
    @ApiOperation({
        summary: '승인 되지 않은 외출 정보만 출력',
        description: '선생님의 승인창',
    })
    @ApiHeader({ name: 'Authorization', description: 'Input accessToken' })
    async get_request_check(@Headers('Authorization') accessToken) {
        let token = await this.authService.validator(accessToken);
        if (!token['grade']) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        let result = this.outService.find_with_request_check(1);
        return result;
    }

    @ApiTags('선생님용 라우터')
    @Patch('approve')
    @ApiCreatedResponse()
    @ApiOperation({
        summary: '외출 요청 승인',
        description: '선생님이 승인할 때 사용됨',
    })
    @ApiHeader({
        name: 'Teacher Authorization',
        description: 'Input accessToken',
    })
    async approveOutReq(
        @Headers('Authorization') accessToken,
        @Body() req: CheckOutRequestDto,
    ) {
        let token = await this.authService.validator(accessToken);
        if (!token['grade']) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        await this.outService.update_GoingRequestdata(req.id, req.status);
        return '승인되었습니다.';
    }

    @ApiTags('학생용 라우터')
    @Post()
    @ApiResponse({ status: 201 })
    @ApiOperation({
        summary: '외출을 요청',
        description: '학생의 외출 요청',
    })
    @ApiHeader({ name: 'Authorization', description: 'Input accessToken' })
    async createOutReq(
        @Headers('Authorization') accessToken,
        @Body() reqBody: CreateOutDataDto,
    ) {
        let info = await this.authService.validator(accessToken);
        let studentObj = await this.studentService.findOneWithId(info.sub);
        try {
            return await this.outService.create(reqBody, studentObj);
        } catch (error) {
            console.error(error);
            throw new HttpException(
                '생성 중 에러 발생. 다시 시도해주세요',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    @ApiTags('선생님용 라우터')
    @Patch('check')
    @ApiResponse({ status: 201 })
    @ApiOperation({
        summary: '외출 귀가 완료창',
        description: '선생님이 귀가 확인시 사용',
    })
    @ApiHeader({ name: 'Authorization', description: 'Input accessToken' })
    async checkOut(
        @Headers('Authorization') accessToken,
        @Body() req: OutBackCheckDto,
    ) {
        let token = await this.authService.validator(accessToken);
        if (!token['grade']) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        await this.outService.updateGoingdata(req.id, 4);
        return '실행됐습니다.';
    }
}
