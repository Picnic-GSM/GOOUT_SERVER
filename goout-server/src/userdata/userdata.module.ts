import { Module } from '@nestjs/common';
import { UserdataService } from './userdata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Userdata } from './userdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Userdata])],
  providers:[UserdataService],
  exports:[TypeOrmModule]
})
export class UserdataModule {}