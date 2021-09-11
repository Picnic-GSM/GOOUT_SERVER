import { ApiProperty } from "@nestjs/swagger";

export class TeacherLoginDto {
    @ApiProperty({description:'사전 배부된 코드'})
    code:string;
}