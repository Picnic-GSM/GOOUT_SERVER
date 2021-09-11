import { ApiProperty } from "@nestjs/swagger";

export class RequestCheckDto {
    @ApiProperty({description:'조퇴 관련 정보를 위한 id값'})
    leaveid:number
}