import { Get, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';
import { CreateGoingDto } from 'src/goingoutdata/goingoutdata.interface';
import { GoingoutDataService } from 'src/goingoutdata/goingoutdata.service';
import { UserdataService } from 'src/userdata/userdata.service';
import * as jwt from 'jsonwebtoken'
import { Goingoutdata } from 'src/goingoutdata/goingoutdata.entity';
import { GoingService } from './going.service';
import * as crypto from 'crypto'


@Controller('going')
export class GoingController {
    constructor(private readonly userdataservice:UserdataService, private readonly goingoutservice:GoingoutDataService,private readonly goingservice:GoingService) {}
    @Get('auth')
    check_authCheck() {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.key);
        let result = cipher.update("3-4", 'utf8', 'base64');
        result += cipher.final('base64');
        return result
    }
    @Get()
    async get_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        let alldata = await this.goingoutservice.findwithclass(3);
        let check_result = await this.goingservice.check_status(alldata);
        alldata = await this.goingoutservice.findwithclass(3);
        return alldata;
    }

    @Get('one')
    async get_first_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        let onedata = await this.goingoutservice.findwithclass(3);
        let check_result = await this.goingservice.check_status(onedata);
        onedata = await this.goingoutservice.findwithclass(3);
        return onedata;
    }

    @Get('two')
    async get_second_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        let twodata = await this.goingoutservice.findwithclass(3);
        let check_result = await this.goingservice.check_status(twodata);
        twodata = await this.goingoutservice.findwithclass(3);
        return twodata;
    }

    @Get('three')
    async get_third_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        let threedata = await this.goingoutservice.findwithclass(3);
        let check_result = await this.goingservice.check_status(threedata);
        threedata = await this.goingoutservice.findwithclass(3);
        return threedata;
    }

    @Get('request-check')
    async get_request_check(@Headers('accessToken') accessToken) {
        let result = this.goingoutservice.find_with_request_check(0);
    }

    @Post('request-check')
    async post_request_check(@Headers('accessToken') accessToken, @Body() req) {
        await this.goingoutservice.update_GoingRequestdata(req.goingid, 1);
        return '성공적으로 실행됐습니다.'
    }

    @Post()
    async create_going(@Headers('accessToken') accessToken, @Body() req:CreateGoingDto) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }
        let decoded = jwt.verify(accessToken,jwtConstants.secret);
        let userdata = await this.userdataservice.findOne(decoded['userid']);
        req.username = userdata.username;
        req.grade = userdata.grade;
        req.class = userdata.class;
        req.s_number = userdata.s_number;
        req.going_status = "외출중"
        try {
            await this.goingoutservice.createGoingout(req);
            return '생성되었습니다.'
        } catch (error) {
            console.log(error);
            throw new HttpException("생성 중 에러 발생. 다시 시도해주세요",HttpStatus.BAD_REQUEST);
        }
    }

    @Post('out-check')
    async out_check(@Headers('accessToken') accessToken, @Body() req) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        await this.goingoutservice.updateGoingdata(req.goingid,'귀가완료');
    }
}
