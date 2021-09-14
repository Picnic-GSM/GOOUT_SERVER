import { ApiProperty } from "@nestjs/swagger";

export class CheckOutRequestDto {
    @ApiProperty({description:'해당 외출의 id값'})
    id:number;
    @ApiProperty({description:'바꿀 상태 값을 입력'})
    response:number;
}