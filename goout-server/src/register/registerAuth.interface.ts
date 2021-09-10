import { ApiProperty } from "@nestjs/swagger";

export class RegisterAuthNumCheck {
  @ApiProperty({ description: "이메일 인증번호" })
  authNum: number;

  @ApiProperty({ description: "해당 유저의 id" })
  userid: number;
}
