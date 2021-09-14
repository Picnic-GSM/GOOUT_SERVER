import { ApiProperty } from "@nestjs/swagger";

export class findTeacherWithGrade {
    @ApiProperty({description:'찾을 학년 입력'})
    grade:number;
}