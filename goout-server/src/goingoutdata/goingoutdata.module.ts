import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goingoutdata } from './goingoutdata.entity';
import { GoingoutService } from './goingoutdata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Goingoutdata])],
  providers:[GoingoutService],
  exports:[TypeOrmModule]
})
export class GoingoutdataModule {}
