import { ApiProperty } from '@nestjs/swagger';

export class FindWithIdDto {
    @ApiProperty({ description: '찾을 대상의 인덱스 번호' })
    id: number;
}
