import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { CreateLeaveDataDto } from 'src/leave/dto/create-leave.dto';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/constants';
import { LeaveDataService } from './leave.service';
import { StudentDataService } from 'src/user/user.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Leave } from 'src/leave/entites/leave.entity';
import { AuthService } from 'src/auth/auth.service';
import { CheckLeaveRequestDto } from './dto/check-leave-request.dto';

@Controller('leave')
export class LeaveController {
    constructor(
        private readonly leaveDataService: LeaveDataService,
        private readonly studentDataService: StudentDataService,
        private readonly authService: AuthService,
    ) {}

    @ApiTags('공용 라우터')
    @ApiResponse({
        description: '조퇴한 모든 학생을 출력',
        type: Leave,
        isArray: true,
        status: 200,
    })
    @HttpCode(200)
    @Get()
    @ApiHeader({ name: 'Authorization', description: 'Input JWT' })
    @ApiOperation({
        summary: '모든 학생의 조퇴 정보',
        description: '조퇴 관련 데이터 받아오기',
    })
    async get_leavedata(@Headers('Authorization') accessToken: string) {
        await this.authService.validator(accessToken);

        let data = await this.leaveDataService.getData();
        return data;
    }

    @ApiTags('공용 라우터')
    @Get('/:grade')
    @HttpCode(200)
    @ApiHeader({ name: 'Authorization', description: 'Input JWT' })
    @ApiOperation({
        summary: '학년별 조퇴 정보 출력',
        description: '학년별 조퇴 데이터 받아오기',
    })
    @ApiResponse({
        description: '학년별 조퇴 학생 출력',
        type: Leave,
        isArray: true,
        status: 200,
    })
    async getLeaveDataWithGrade(
        @Headers('Authorization') accessToken,
        @Param('grade') grade: number,
    ) {
        await this.authService.validator(accessToken);

        let leaveObj = await this.leaveDataService.findWithGrade(grade);
        return leaveObj;
    }

    @ApiTags('선생님용 라우터')
    @Get('request-check')
    @HttpCode(200)
    @ApiResponse({
        description: '미승인된 조퇴 목록 출력',
        type: Leave,
        isArray: true,
        status: 200,
    })
    @ApiHeader({ name: 'Authorization', description: 'Input JWT' })
    @ApiOperation({
        summary: '조퇴 미승인 목록',
        description: '미승인된 조퇴 정보 출력',
    })
    async get_request_check(@Headers('Authorization') accessToken) {
        let token = await this.authService.validator(accessToken);
        if (!token['grade']) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        let result = await this.leaveDataService.find_with_request_check(0);
        return result;
    }

    @ApiTags('선생님용 라우터')
    @Post('request-check')
    @HttpCode(201)
    @ApiHeader({ name: 'Authorization', description: 'Input JWT' })
    @ApiOperation({
        summary: '조퇴 승인',
        description: '선생님이 조퇴를 허가해줌',
    })
    @ApiResponse({ status: 201 })
    async post_request_check(
        @Headers('Authorization') accessToken,
        @Body() req: CheckLeaveRequestDto,
    ) {
        let token = await this.authService.validator(accessToken);
        if (!token['grade']) {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        let decoded = jwt.verify(accessToken, jwtConstants.secret);
        if (decoded['grade']) {
            //await this.leaveDataService.checkRequest(req.id, req.response);
            return '성공적으로 실행됐습니다.';
        } else {
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
    }
    @ApiTags('학생용 라우터')
    @Post()
    @HttpCode(201)
    @ApiHeader({ name: 'Authorization', description: 'Input JWT' })
    @ApiOperation({
        summary: '조퇴 신청',
        description: '학생이 조퇴를 신청할 때 사용',
    })
    @ApiResponse({ status: 201 })
    async leave_request(
        @Headers('Authorization') accessToken,
        @Body() req: CreateLeaveDataDto,
    ) {
        const info = await this.authService.validator(accessToken);
        const studentObj = await this.studentDataService.findOneWithId(
            info.sub,
        );
        try {
            await this.leaveDataService.create(req, studentObj);
            return '신청되었습니다.';
        } catch (error) {
            console.log(error);
            throw new HttpException(
                '생성 중 에러 발생. 다시 시도해주세요',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
