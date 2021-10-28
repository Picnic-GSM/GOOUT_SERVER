import { ApiProperty } from '@nestjs/swagger';

export class OutBackCheckDto {
    @ApiProperty({ description: '귀가 완료 시킬 외출 데이터의 인덱스값' })
    idx: number;
}
