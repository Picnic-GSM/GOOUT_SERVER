import { ApiProperty } from "@nestjs/swagger";

export class CheckLeaveRequestDto {
    @ApiProperty({description:'해당 조퇴의 id값'})
    id:number;
    response:number;
}