import { ApiProperty } from '@nestjs/swagger';

export class FindWithGradeAndClassDto {
    @ApiProperty({ description: '찾을 학년 입력' })
    grade: number;

    @ApiProperty({ description: '찾을 반 입력' })
    class: number;
}
