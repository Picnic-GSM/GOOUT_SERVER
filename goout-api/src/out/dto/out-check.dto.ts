import { ApiProperty } from "@nestjs/swagger";

export class OutCheckDto {
  @ApiProperty({ description: "외출 관련 정보가 있는 id값" })
  id: number;
}
