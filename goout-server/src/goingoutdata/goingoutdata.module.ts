import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goingoutdata } from './goingoutdata.entity';
import { GoingoutDataService } from './goingoutdata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Goingoutdata])],
  providers:[GoingoutDataService],
  exports:[TypeOrmModule]
})
export class GoingoutdataModule {}
