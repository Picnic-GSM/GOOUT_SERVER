import { ApiProperty } from "@nestjs/swagger";

export class LoginReqDto {
  @ApiProperty({ description: "student email" })
  email: string;

  @ApiProperty({ description: "student password" })
  password: string;
}
