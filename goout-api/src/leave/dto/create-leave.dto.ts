import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveDataDto {
    @ApiProperty({ description: '조퇴 시작 시간' })
    start_at: Date;

    @ApiProperty({ description: '외출 이유' })
    reason: string;
}
