import { ApiProperty } from "@nestjs/swagger";

export class FindTeacherWithGradeNClass {
    @ApiProperty({description:'찾을 선생님의 학년'})
    grade:number;
    @ApiProperty({description:'찾을 선생님의 반'})
    class:number;
}