import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LeaveService } from './leave.service';

@Module({
  providers: [LeaveService]
})
export class LeaveModule {}
