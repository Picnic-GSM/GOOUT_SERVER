import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateLeavedataDto } from 'src/leavedata/leavedata.interface';
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'src/auth/constants';
import { LeavedataService } from 'src/leavedata/leavedata.service';
import { UserdataService } from 'src/userdata/userdata.service';

@Controller('leave')
export class LeaveController {
    constructor(private readonly leavedataservice:LeavedataService,private readonly userdataservice:UserdataService) {}

    @Get()
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
    async get_request_check(@Headers('accessToken') accessToken) {
        let result = await this.leavedataservice.find_with_request_check(0);
        return result;
    }

    @Post('request-check')
    async post_request_check(@Headers('accessToken') accessToken, @Body() req) {
        await this.leavedataservice.CheckRequest(req.goingid);
        return '성공적으로 실행됐습니다.'
    }

    @Post()
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