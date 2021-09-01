import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserdataService } from 'src/userdata/userdata.service';
import { RegisterService } from './register.service';

@Module({
  providers: [RegisterService,UserdataService]
})
export class RegisterModule {}
