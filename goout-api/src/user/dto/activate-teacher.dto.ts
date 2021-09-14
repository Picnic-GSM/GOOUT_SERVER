import { ApiProperty } from "@nestjs/swagger";

export class LoginForTeacherDto {
  @ApiProperty({ description: "사전 배부된 활성화 코드" })
  code: number;
}
