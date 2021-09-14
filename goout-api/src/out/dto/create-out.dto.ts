import { ApiProperty } from "@nestjs/swagger";

export class CreateOutDataDto {
  @ApiProperty({ description: "외출 시작 시간" })
  start_at: string;

  @ApiProperty({ description: "외출 끝나는 시간" })
  end_at: string;

  @ApiProperty({ description: "외출의 이유" })
  reason: string;

  status: Status;

  user_id: number;
}

enum Status {
  Disapproved = 1,
  Rejected = 2,
  Approved = 3,
  Returned = 4,
}
