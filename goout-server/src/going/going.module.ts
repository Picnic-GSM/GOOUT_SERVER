import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goingoutdata } from 'src/goingoutdata/goingoutdata.entity';
import { GoingoutDataService } from 'src/goingoutdata/goingoutdata.service';
import { Userdata } from 'src/userdata/userdata.entity';
import { UserdataService } from 'src/userdata/userdata.service';
import { GoingService } from './going.service';

@Module({
  imports:[TypeOrmModule.forFeature([Goingoutdata,Userdata])],
  providers: [GoingService,GoingoutDataService,UserdataService]
})
export class GoingModule {}
