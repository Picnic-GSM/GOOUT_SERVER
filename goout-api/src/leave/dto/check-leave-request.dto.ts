import { ApiProperty } from '@nestjs/swagger';
import { LeaveStatus } from '../enum';

export class UpdateLeaveRequestDto {
    @ApiProperty({ description: '해당 조퇴의 id값' })
    id: number;

    @ApiProperty({ description: '변경할 상태값 ' })
    status: LeaveStatus;
}
