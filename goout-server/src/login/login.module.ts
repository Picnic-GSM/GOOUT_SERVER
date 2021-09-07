import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherData } from 'src/teacherdata/teacherdata.entity';
import { TeacherdataService } from 'src/teacherdata/teacherdata.service';
import { Userdata } from 'src/userdata/userdata.entity';
import { UserdataService } from 'src/userdata/userdata.service';

@Module({
    imports:[TypeOrmModule.forFeature([TeacherData,Userdata])],
    providers:[UserdataService,TeacherdataService]
})
export class LoginModule {}
