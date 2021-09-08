import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoingService } from 'src/going/going.service';
import { Goingoutdata } from './goingoutdata.entity';
import { GoingoutDataService } from './goingoutdata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Goingoutdata])],
  providers:[GoingoutDataService,GoingService],
  exports:[TypeOrmModule]
})
export class GoingoutdataModule {}
