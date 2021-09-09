import { ApiProperty } from "@nestjs/swagger";

export class GoingOutCheckDto {
  @ApiProperty({ description: "외출 관련 정보가 있는 id값" })
  goingid: number;
}
