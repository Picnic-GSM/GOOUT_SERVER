import { ApiProperty } from "@nestjs/swagger";

export class CreateGoingDto {
  @ApiProperty({ description: "외출 시작 시간" })
  start_time: string;
  @ApiProperty({ description: "외출 끝나는 시간" })
  end_time: string;
  @ApiProperty({ description: "외출의 이유" })
  reason: string;
  status: string;
}
