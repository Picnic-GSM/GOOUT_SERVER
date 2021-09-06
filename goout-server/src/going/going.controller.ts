import { Get, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';
import { CreateGoingDto } from 'src/goingoutdata/goingoutdata.interface';
import { GoingoutDataService } from 'src/goingoutdata/goingoutdata.service';
import { UserdataService } from 'src/userdata/userdata.service';
import * as jwt from 'jsonwebtoken'

@Controller('going')
export class GoingController {
    constructor(private readonly userdataservice:UserdataService, private readonly goingoutservice:GoingoutDataService) {}

    @Get()
    async get_goingoutdata() {
        let alldata = await this.goingoutservice.getData();
        let change;
        let status;
        alldata.forEach(async going => {
            let goingtime = going.end_time
            let hour = Number(goingtime.substring(0,goingtime.indexOf(':')));
            let min = Number(goingtime.substring(goingtime.indexOf(':')+1,5));
            let time = new Date();
            let nowhour = time.getHours();
            let nowmin = time.getMinutes();
            
            console.log(nowhour,nowmin)
            if(nowhour > hour) {
                status = await '지각'
            } else if(nowhour == hour) {
                if(nowmin > min) {
                    status = await '지각'
                } else {
                    status = await '외출중'
                }
            } else {
                status = await '외출중'
            }
            console.log(hour,min,status)
            change = await this.goingoutservice.updateGoingdata(going.goingid,status);
        });
        return alldata;
    }

    @Get('one')
    async get_first_goingoutdata() {
        let onedata:any = await this.goingoutservice.findwithclass(1);
        let change;
        let status;
        onedata.forEach(async going => {
            let goingtime = going.end_time
            let hour = Number(goingtime.substring(0,goingtime.indexOf(':')));
            let min = Number(goingtime.substring(goingtime.indexOf(':')+1,5));
            let time = new Date();
            let nowhour = time.getHours();
            let nowmin = time.getMinutes();
            
            console.log(nowhour,nowmin)
            if(nowhour > hour) {
                status = await '지각'
            } else if(nowhour == hour) {
                if(nowmin > min) {
                    status = await '지각'
                } else {
                    status = await '외출중'
                }
            } else {
                status = await '외출중'
            }
            console.log(hour,min,status)
            change = await this.goingoutservice.updateGoingdata(going.goingid,status);
        });
        return onedata;
    }

    @Get('two')
    async get_second_goingoutdata() {
        let twodata:any = await this.goingoutservice.findwithclass(2);
        let change;
        let status;
        twodata.forEach(async going => {
            let goingtime = going.end_time
            let hour = Number(goingtime.substring(0,goingtime.indexOf(':')));
            let min = Number(goingtime.substring(goingtime.indexOf(':')+1,5));
            let time = new Date();
            let nowhour = time.getHours();
            let nowmin = time.getMinutes();
            
            console.log(nowhour,nowmin)
            if(nowhour > hour) {
                status = await '지각'
            } else if(nowhour == hour) {
                if(nowmin > min) {
                    status = await '지각'
                } else {
                    status = await '외출중'
                }
            } else {
                status = await '외출중'
            }
            console.log(hour,min,status)
            change = await this.goingoutservice.updateGoingdata(going.goingid,status);
        });
        return twodata;
    }

    @Get('three')
    async get_third_goingoutdata() {
        let threedata:any = await this.goingoutservice.findwithclass(3);
        let change;
        let status;
        threedata.forEach(async going => {
            let goingtime = going.end_time
            let hour = Number(goingtime.substring(0,goingtime.indexOf(':')));
            let min = Number(goingtime.substring(goingtime.indexOf(':')+1,5));
            let time = new Date();
            let nowhour = time.getHours();
            let nowmin = time.getMinutes();
            
            console.log(nowhour,nowmin)
            if(nowhour > hour) {
                status = await '지각'
            } else if(nowhour == hour) {
                if(nowmin > min) {
                    status = await '지각'
                } else {
                    status = await '외출중'
                }
            } else {
                status = await '외출중'
            }
            console.log(hour,min,status)
            change = await this.goingoutservice.updateGoingdata(going.goingid,status);
        });
        return threedata;
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
