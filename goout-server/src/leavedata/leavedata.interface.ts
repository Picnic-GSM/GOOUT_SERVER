import { ApiProperty } from "@nestjs/swagger";

export class CreateLeavedataDto {
  @ApiProperty({ description: "외출 시작 시간" })
  start_at: string;
  status: string;
  @ApiProperty({description:"외출 이유"})
  reason:string;
}
