import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { UserdataService } from 'src/userdata/userdata.service';
import { LoginService } from './login.service';
import * as crypto from 'crypto'
import { LoginDataDto } from 'src/userdata/login.interface';
import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {
    constructor(private readonly userdataservice:UserdataService,private readonly authservice:AuthService) {}
    
    @Get()
    getdata() {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.key);
        let result = cipher.update('암호화할문장', 'utf8', 'base64');
        result += cipher.final('base64');

        const decipher = crypto.createDecipher('aes-256-cbc', process.env.key);
        let result2 = decipher.update(result, 'base64', 'utf8');
        result2 += decipher.final('utf8'); 
    }
    
    @Post()
    async login(@Body() req:LoginDataDto) {
        let user = await this.userdataservice.findwithEmail(req.email);
        if(user == undefined) {
            throw new HttpException('아이디를 찾을 수 없습니다',HttpStatus.BAD_REQUEST)
        }
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.key);
        let result = decipher.update(user.password, 'base64', 'utf8');
        result += decipher.final('utf8');

        if(result == req.password) {
            return this.authservice.IssueJWT(user);
        } else {
            throw new HttpException('비밀번호가 잘못 됐습니다',HttpStatus.BAD_REQUEST);            
        }
    }
}
