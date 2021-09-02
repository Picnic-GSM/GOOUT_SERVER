import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateLeavedataDto } from 'src/leavedata/leavedata.interface';
import { UserdataService } from 'src/userdata/userdata.service';
import jwt_decode from "jwt-decode";
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'src/auth/constants';

@Controller('leave')
export class LeaveController {
    constructor(private readonly userdataservice:UserdataService) {}

    @Post()
    async leave_request(@Headers("accessToken") accessToken, @Body() req:CreateLeavedataDto) {
        //let decode:any = jwt_decode(accessToken);
        let decoded = jwt.verify(accessToken,jwtConstants.secret)
        return decoded
    }
}
