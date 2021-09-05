import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leavedata } from './leavedata.entity';
import { LeavedataService } from './leavedata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Leavedata])],
  providers:[LeavedataService],
  exports:[TypeOrmModule]
})
export class LeavedataModule {}
