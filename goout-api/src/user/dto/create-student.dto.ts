import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentDto {
  @ApiProperty({ description: "student name" })
  name: string;

  @ApiProperty({ description: "student password" })
  password: string;

  @ApiProperty({ description: "student email" })
  email: string;

  @ApiProperty({ description: "student grade" })
  grade: number;

  @ApiProperty({ description: "student class" })
  class: number;

  @ApiProperty({ description: "student number" })
  s_number: number;
}
