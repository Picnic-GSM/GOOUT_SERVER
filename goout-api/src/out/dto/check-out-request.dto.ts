import { ApiProperty } from "@nestjs/swagger";

export class CheckOutRequestDto {
    @ApiProperty({description:'해당 외출의 id값'})
    id:number;
    response:number;
}