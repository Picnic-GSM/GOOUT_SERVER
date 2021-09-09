import { ApiProperty } from "@nestjs/swagger";

export class CreateLeavedataDto {
  username: string;
  grade: number;
  class: number;
  s_number: number;
  @ApiProperty({ description: "leave start time" })
  start_time: string;
  request: number;
  back_check: string;
}
