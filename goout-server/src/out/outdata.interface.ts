import { ApiProperty } from "@nestjs/swagger";

export class CreateGoingDto {
  @ApiProperty({ description: "goingout start time" })
  start_time: string;
  @ApiProperty({ description: "goingout endtime" })
  end_time: string;
  @ApiProperty({ description: "goingout reason" })
  reason: string;
  request: number;
  going_status: string;
  back_check: number;
}
