import { ApiProperty } from "@nestjs/swagger";

export class SendEmailDto {
  @ApiProperty({ description: "인증번호를 보낼 이메일 주소" })
  email: string;
}
