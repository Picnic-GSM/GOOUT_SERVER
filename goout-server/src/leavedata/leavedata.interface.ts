import { ApiProperty } from "@nestjs/swagger";

export class CreateLeavedataDto {
  @ApiProperty({ description: "leave start time" })
  start_at: string;
  status: string;
}
