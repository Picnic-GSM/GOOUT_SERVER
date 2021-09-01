import { Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { RegisterDataDto } from 'src/userdata/register.interface';
import { UserdataService } from 'src/userdata/userdata.service';

@Controller('register')
export class RegisterController {
    constructor(private readonly userdataservice:UserdataService) {}

    @Post()
    register(@Req() req:RegisterDataDto) {
        let exist = this.userdataservice.findwithEmail(req.email);
        if(exist != undefined) {
            throw new HttpException("이메일이 이미 존재합니다",HttpStatus.BAD_REQUEST);
        }
        this.userdataservice.createUserdata(req);
    }
}
