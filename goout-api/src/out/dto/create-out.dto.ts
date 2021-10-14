import { ApiProperty } from "@nestjs/swagger";
import { OutStatus } from "../enum";

export class CreateOutDataDto {
  @ApiProperty({ description: "외출 시작 시간" })
  start_at: string;

  @ApiProperty({ description: "외출 끝나는 시간" })
  end_at: string;

  @ApiProperty({ description: "외출의 이유" })
  reason: string;
}
