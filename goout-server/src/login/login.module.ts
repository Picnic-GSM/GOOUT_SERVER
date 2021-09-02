import { Module } from '@nestjs/common';
import { UserdataService } from 'src/userdata/userdata.service';

@Module({})
export class LoginModule {
    providers:[UserdataService]
}
