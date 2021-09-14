import { ApiProperty } from "@nestjs/swagger";

export class OutBackCheckDto {
    @ApiProperty({description:"귀가 시킬 학생의 id값"})
    id:number;
}