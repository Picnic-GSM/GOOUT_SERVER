import { ApiProperty } from "@nestjs/swagger";

export class GoingRequestCheckDto {
    @ApiProperty({description:'외출 허가를 위한 id값'})
    goingid:number;
}