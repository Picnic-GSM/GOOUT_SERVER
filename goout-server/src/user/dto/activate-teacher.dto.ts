import { ApiProperty } from "@nestjs/swagger";

export class ActivateTeacherDto {
  @ApiProperty({ description: "사전 배부된 활성화 코드" })
  activateCode: number;
}
