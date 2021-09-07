import { Get, HttpCode, HttpStatus } from '@nestjs/common';
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
import { ApiBody, ApiHeader, ApiOperation, ApiProperty, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { GoingRequestCheckDto } from './requestcheck.interface';
import { GoingOutCheckDto } from './outcheck.interface';


@Controller('going')
export class GoingController {
    constructor(private readonly userdataservice:UserdataService, private readonly goingoutservice:GoingoutDataService,private readonly goingservice:GoingService) {}
    
    @ApiTags('공용 라우터')
    @Get()
    @HttpCode(200)
    @ApiResponse({description:'조퇴한 모든 학생을 출력',type:Goingoutdata,isArray:true,status:200})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    @ApiOperation({summary:'외출한 학생 모두 출력',description:'외출 정보를 반환'})
    async get_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
        }

        let alldata = await this.goingoutservice.getData();
        let result = await this.goingservice.check_status(alldata);
        alldata = await this.goingoutservice.getData();
        if(!alldata) {
           // throw or ?
        }
        return alldata;
    }

    @ApiTags('공용 라우터')
    @Get('one')
    @HttpCode(200)
    @ApiResponse({description:'외출한 1학년 출력',type:Goingoutdata,isArray:true,status:200})
    @ApiOperation({summary:'1학년 외출 학생만 출력', description:'외출 정보를 반환'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async get_first_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
        }

        let onedata = await this.goingoutservice.findwithclass(1);
        return onedata;
    }

    @ApiTags('공용 라우터')
    @Get('two')
    @ApiResponse({description:'외출한 2학년 출력',type:Goingoutdata,isArray:true,status:200})
    @HttpCode(200)
    @ApiOperation({summary:'2학년 외출 학생만 출력',description:'외출 정보를 반환'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async get_second_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
        }

        let twodata = await this.goingoutservice.findwithclass(2);
        return twodata;
    }

    @ApiTags('공용 라우터')
    @Get('three')
    @ApiResponse({description:'외출한 3학년 출력',type:Goingoutdata,isArray:true,status:200})
    @HttpCode(200)
    @ApiOperation({summary:'3학년 외출 학생만 출력',description:'외출 정보를 반환'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async get_third_goingoutdata(@Headers("accessToken") accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
        }

        let threedata = await this.goingoutservice.findwithclass(3);
        return threedata;
    }

    @ApiTags('선생님용 라우터')
    @Get('request-check')
    @HttpCode(200)
    @ApiResponse({description:'승인 되지 않은 외출 정보들 출력',type:Goingoutdata,isArray:true,status:200})
    @ApiOperation({summary:'승인 되지 않은 외출 정보만 출력',description:'선생님의 승인창'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async get_request_check(@Headers('accessToken') accessToken) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
        }
        let result = this.goingoutservice.find_with_request_check(0);
        return result;
    }

    @ApiTags('선생님용 라우터')
    @Post('request-check')
    @HttpCode(201)
    @ApiResponse({status:201})
    @ApiOperation({summary:'외출을 승인시켜주는 창',description:'선생님이 승인할 때 사용됨'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async post_request_check(@Headers('accessToken') accessToken, @Body() req:GoingRequestCheckDto) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
        }
        await this.goingoutservice.update_GoingRequestdata(req.goingid, 1);
        return '성공적으로 실행됐습니다.'
    }

    @ApiTags('학생용 라우터')
    @Post()
    @HttpCode(201)
    @ApiResponse({status:201})
    @ApiOperation({summary:'외출을 요청',description:'학생들이 외출을 요청시켜줌'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async create_going(@Headers('accessToken') accessToken, @Body() req:CreateGoingDto) {
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
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
            throw new HttpException("생성 중 에러 발생. 다시 시도해주세요",HttpStatus.UNAUTHORIZED);
        }
    }

    @ApiTags('선생님용 라우터')
    @Post('out-check')
    @ApiResponse({status:201})
    @HttpCode(201)
    @ApiOperation({summary:'외출 귀가 완료창',description:'선생님이 귀가 확인시 사용'})
    @ApiHeader({name:'accessToken',description:'Input JWT'})
    async out_check(@Headers('accessToken') accessToken, @Body() req:GoingOutCheckDto) {
        
        try {
            let decoded = jwt.verify(accessToken,jwtConstants.secret);
        } catch (error) {
            throw new HttpException("token is expired",HttpStatus.UNAUTHORIZED)
        }

        await this.goingoutservice.updateGoingdata(req.goingid,'귀가완료');
        return '성공적으로 실행됐습니다.'
    }
}
