import { ApiProperty } from "@nestjs/swagger";

export class EmailAuthDto {
  @ApiProperty({ description: "이메일 인증번호" })
  authCode: number;

  @ApiProperty({ description: "해당 유저의 id" })
  userId: number;
}
