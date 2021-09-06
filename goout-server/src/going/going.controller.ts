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
import { ApiHeader, ApiOperation, ApiProperty, ApiTags, getSchemaPath } from '@nestjs/swagger';


@Controller('going')
@ApiTags('외출 관련 라우터')
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
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'외출한 학생 모두 출력',description:'외출 정보를 반환'})
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
    @ApiOperation({summary:'1학년 외출 학생만 출력', description:'외출 정보를 반환'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
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
    @ApiOperation({summary:'2학년 외출 학생만 출력',description:'외출 정보를 반환'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
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
    @ApiOperation({summary:'3학년 외출 학생만 출력',description:'외출 정보를 반환'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
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
    @ApiOperation({summary:'승인 되지 않은 외출 정보만 출력',description:'선생님의 승인창'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async get_request_check(@Headers('accessToken') accessToken) {
        let result = this.goingoutservice.find_with_request_check(0);
    }

    @Post('request-check')
    @ApiOperation({summary:'외출을 승인시켜주는 창',description:'선생님이 승인할 때 사용됨'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async post_request_check(@Headers('accessToken') accessToken, @Body() req) {
        await this.goingoutservice.update_GoingRequestdata(req.goingid, 1);
        return '성공적으로 실행됐습니다.'
    }

    @Post()
    @ApiOperation({summary:'외출을 요청',description:'학생들이 외출을 요청시켜줌'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
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
    @ApiOperation({summary:'외출 귀가 완료창',description:'선생님이 귀가 확인시 사용'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async out_check(@Headers('accessToken') accessToken, @Body() req) {
        
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.BAD_REQUEST)
        }

        await this.goingoutservice.updateGoingdata(req.goingid,'귀가완료');
    }
}
