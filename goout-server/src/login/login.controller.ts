import { Controller, Get, Post } from '@nestjs/common';
import { UserdataService } from 'src/userdata/userdata.service';
import { LoginService } from './login.service';
import * as crypto from 'crypto'

@Controller('login')
export class LoginController {
    constructor(private readonly userdataservice:UserdataService) {}
    
    @Get()
    getdata() {
        let iv = crypto.randomBytes(16);
        const key_in_bytes = Buffer.from(process.env.key, 'base64')
        const cipher = crypto.createCipheriv('aes-256-cbc', process.env.key_in_bytes,iv);
        let result = cipher.update('암호화할문장', 'utf8', 'base64');
        result += cipher.final('base64');
        console.log(result)
        const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.key_in_bytes,iv);
        let result2 = decipher.update(result, 'base64', 'utf8');
        result2 += decipher.final('utf8'); 
        console.log(result2)
    }
    
    @Post()
    login() {

    }
}
