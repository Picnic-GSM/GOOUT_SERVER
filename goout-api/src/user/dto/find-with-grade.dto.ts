import { ApiProperty } from '@nestjs/swagger';

export class FindWithGradeDto {
    @ApiProperty({ description: '찾을 학년(1~4) 입력 ' })
    grade: number;
}
