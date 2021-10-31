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

        return await this.outService.getData();
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
        if (!outObj.length)
            // 정보가 없을 경우 204 No Content로 응답
            throw new HttpException('정보 없음', HttpStatus.NO_CONTENT);
        return await this.outService.checkStatus(outObj);
    }

    @ApiTags('선생님용 라우터')
    @Get('/disapproved')
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
    async getDisapprovedRequest(@Headers('Authorization') accessToken) {
        const payload = await this.authService.validator(accessToken);
        if (this.authService.classifyToken(payload)) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        return this.outService.findWithStatus(1); // 미승인 상태인 데이터만 조회
    }

    @ApiTags('선생님용 라우터')
    @Patch('/approve')
    @ApiCreatedResponse()
    @ApiOperation({
        summary: '외출 요청 승인',
        description: '선생님이 승인할 때 사용됨',
    })
    @ApiHeader({
        name: 'Teacher Authorization',
        description: 'Input accessToken',
    })
    async approveOutRequest(
        @Headers('Authorization') accessToken,
        @Body() req: CheckOutRequestDto,
    ) {
        const payload = await this.authService.validator(accessToken);
        if (this.authService.classifyToken(payload)) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        await this.outService.updateStatusWithId(req.idx, req.status);
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
        let payload = await this.authService.validator(accessToken);
        if (!this.authService.classifyToken(payload)) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        const studentObj = await this.studentService.findOneWithId(payload.sub);
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
    @Patch('/return')
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
        const payload = await this.authService.validator(accessToken);
        if (this.authService.classifyToken(payload)) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        return await this.outService.updateStatusWithId(req.idx, 4);
    }
}
