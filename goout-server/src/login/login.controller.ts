import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { UserdataService } from 'src/userdata/userdata.service';
import { LoginService } from './login.service';
import * as crypto from 'crypto'
import { LoginDataDto } from 'src/userdata/login.interface';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeacherdataService } from 'src/teacherdata/teacherdata.service';
import { TeacherLoginDto } from './loginuser.interface';

@ApiTags('학생 정보 관련 라우터')
@Controller('login')
export class LoginController {
    constructor(private readonly userdataservice:UserdataService,private readonly authservice:AuthService,private readonly teacherdataservice:TeacherdataService) {}
    
    @ApiOperation({summary:'로그인',description:'선생님과 학생의 로그인'})
    @Post()
    async login(@Body() req:LoginDataDto) {
        let user = await this.userdataservice.findwithEmail(req.email);
        console.log(user)
        if(user == undefined) {
            throw new HttpException('아이디를 찾을 수 없습니다',HttpStatus.BAD_REQUEST)
        }
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.key);
        let result = decipher.update(user.password, 'base64', 'utf8');
        result += decipher.final('utf8');

        if(result == req.password) {
            throw new HttpException('비밀번호가 잘못 됐습니다',HttpStatus.BAD_REQUEST);
        } else {
            return this.authservice.IssueJWT(user);
        }
    }

    @Post('teacher')
    @ApiOperation({summary:'선생님 로그인',description:'코드로 로그인'})
    async Code_Login(@Body() req:TeacherLoginDto) {
        let teacherdata = await this.teacherdataservice.findOnewithCode(req.code);
        if(teacherdata == null) throw new HttpException("인증코드가 잘못됐습니다.",HttpStatus.BAD_REQUEST)
        return await this.authservice.IssueJWTforTeacher(teacherdata.grade,teacherdata.class);

    }
}
