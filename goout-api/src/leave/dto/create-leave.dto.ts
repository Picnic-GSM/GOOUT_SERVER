import { ApiProperty } from "@nestjs/swagger";
import { LeaveStatus } from "../enum";

export class CreateLeaveDataDto {
  @ApiProperty({ description: "외출 시작 시간" })
  start_at: string;

  @ApiProperty({ description: "외출 이유" })
  reason: string;

  user_id: number;
}
