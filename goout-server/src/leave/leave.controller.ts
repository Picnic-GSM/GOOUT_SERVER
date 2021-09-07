import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateLeavedataDto } from 'src/leavedata/leavedata.interface';
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'src/auth/constants';
import { LeavedataService } from 'src/leavedata/leavedata.service';
import { UserdataService } from 'src/userdata/userdata.service';
import { ApiHeader, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RequestCheckDto } from './request-check.interface';

@ApiTags('조퇴 관련 라우터')
@Controller('leave')
export class LeaveController {
    constructor(private readonly leavedataservice:LeavedataService,private readonly userdataservice:UserdataService) {}

    @Get()
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'모든 학생의 조퇴 정보', description:'조퇴 관련 데이터 받아오기'})
    async get_leavedata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }
        
        let data = await this.leavedataservice.getData();
        return data;
    }

    @Get('one')
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'1학년의 조퇴 정보',description:'1학년 학생의 조퇴 데이터 받아오기'})
    async first_grade_leavedata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        let data = await this.leavedataservice.findwithclass(1)
        return data;
    }

    @Get('two')
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'2학년의 조퇴 정보',description:'2학년 학생의 조퇴 데이터 받아오기'})
    async second_grade_leavedata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        let data = await this.leavedataservice.findwithclass(2)
        return data;
    }

    @Get('three')
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'3학년의 조퇴 정보',description:'3학년 학생의 조퇴 데이터 받아오기'})
    async third_grade_leavedata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        let data = await this.leavedataservice.findwithclass(3)
        return data;
    }
    @Get('request-check')
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'조퇴 미승인 목록',description:'미승인된 조퇴 정보 출력'})
    async get_request_check(@Headers('accessToken') accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }
        let result = await this.leavedataservice.find_with_request_check(0);
        return result;
    }

    @Post('request-check')
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'조퇴 승인',description:'선생님이 조퇴를 허가해줌'})
    async post_request_check(@Headers('accessToken') accessToken, @Body() req:RequestCheckDto) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }
        await this.leavedataservice.CheckRequest(req.leaveid);
        return '성공적으로 실행됐습니다.'
    }

    @Post()
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'조퇴 신청',description:'학생이 조퇴를 신청할 때 사용'})
    async leave_request(@Headers("accessToken") accessToken, @Body() req:CreateLeavedataDto) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }
        let decoded = jwt.verify(accessToken,jwtConstants.secret);
        let userdata = await this.userdataservice.findOne(decoded['userid']);
        console.log(userdata);
        req.username = userdata.username;
        req.grade = userdata.grade;
        req.class = userdata.class;
        req.s_number = userdata.s_number;
        try {
            let createleavedata = await this.leavedataservice.createLeavedata(req);
            return '생성되었습니다.'
        } catch (error) {
            console.log(error);
            throw new HttpException("생성 중 에러 발생. 다시 시도해주세요",HttpStatus.BAD_REQUEST);
        }

    }
}