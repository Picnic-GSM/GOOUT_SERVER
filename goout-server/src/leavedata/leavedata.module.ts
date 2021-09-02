import { Module } from '@nestjs/common';
import { LeavedataService } from './leavedata.service';

@Module({
  providers: [LeavedataService]
})
export class LeavedataModule {}
