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
import { LeaveDataService } from './leave.service';
import { StudentDataService } from 'src/user/user.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Leave } from 'src/leave/entites/leave.entity';
import { AuthService } from 'src/auth/auth.service';
import { UpdateLeaveRequestDto } from './dto/check-leave-request.dto';

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
    async getLeaveData(@Headers('Authorization') accessToken: string) {
        await this.authService.validator(accessToken);

        return await this.leaveDataService.getData();
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

        return await this.leaveDataService.findWithGrade(grade);
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
    async getDisapprovedLeaveRequest(@Headers('Authorization') accessToken) {
        await this.authService.validator(accessToken);
        return await this.leaveDataService.findWithStatus(0);
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
    async approveLeaveRequest(
        @Headers('Authorization') accessToken,
        @Body() req: UpdateLeaveRequestDto,
    ) {
        const payload = await this.authService.validator(accessToken);
        if (this.authService.classifyToken(payload)) {
            // 교사인지 확인
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        return this.leaveDataService.updateStatusWithId(req.id, req.status);
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
    async registerLeave(
        @Headers('Authorization') accessToken,
        @Body() req: CreateLeaveDataDto,
    ) {
        const payload = await this.authService.validator(accessToken);
        if (!this.authService.classifyToken(payload)) {
            // 학생인지 확인
            throw new HttpException('권한 없음', HttpStatus.FORBIDDEN);
        }
        const studentObj = await this.studentDataService.findOneWithId(
            payload.sub,
        );
        return await this.leaveDataService.create(req, studentObj);
    }
}
