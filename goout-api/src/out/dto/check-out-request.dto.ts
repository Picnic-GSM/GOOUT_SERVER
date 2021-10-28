import { ApiProperty } from '@nestjs/swagger';

export class CheckOutRequestDto {
    @ApiProperty({ description: '해당 외출 요청 데이터의 인덱스값' })
    idx: number;

    @ApiProperty({ description: '바꿀 상태 값을 입력' })
    status: number;
}
