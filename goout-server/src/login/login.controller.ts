import { Controller, Get, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private readonly loginservice:LoginService) {}
    
    @Get()
    getdata() {
        
    }
    
    @Post()
    login() {

    }
}
