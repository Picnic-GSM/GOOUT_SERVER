import { ApiProperty } from '@nestjs/swagger';

export class ShowGradeDto {
    @ApiProperty({ description: '보고싶은 학년' })
    grade: number;
}
