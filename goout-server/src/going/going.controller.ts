import { Get, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';
import { CreateGoingDto } from 'src/goingoutdata/goingoutdata.interface';
import { GoingoutDataService } from 'src/goingoutdata/goingoutdata.service';
import { UserdataService } from 'src/userdata/userdata.service';
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'

@Controller('going')
export class GoingController {
    constructor(private readonly userdataservice:UserdataService, private readonly goingoutservice:GoingoutDataService) {}

    @Get()
    check() {
        let goingtime = "12:14"
        let hour = Number(goingtime.substring(0,2));
        let min = Number(goingtime.substring(3,5));
        let time = new Date();
        let nowhour = time.getHours();
        let nowmin = time.getMinutes();
        if(nowhour > hour) {
            console.log('지각')
        } else if(nowhour == hour) {
            if(nowmin > min) {
                console.log('지각')
            } else {
                console.log('외출중')
            }
        } else {
            console.log('외출중')
        }
        return time;

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
            let result = await this.goingoutservice.createGoingout(req);
            return '생성되었습니다.'
        } catch (error) {
            console.log(error);
            throw new HttpException("생성 중 에러 발생. 다시 시도해주세요",HttpStatus.BAD_REQUEST);
        }
    }
}
