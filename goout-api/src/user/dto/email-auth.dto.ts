import { ApiProperty } from "@nestjs/swagger";

export class ActivateAccountDto {
  @ApiProperty({ description: "이메일 인증번호" })
  authCode: number;

  @ApiProperty({ description: "해당 학생 데이터의 인덱스" })
  id: number;
}
