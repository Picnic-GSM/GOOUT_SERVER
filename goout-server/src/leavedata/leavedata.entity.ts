import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Leavedata {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "조퇴 id" })
  leaveid: number;

  @ApiProperty({ description: "조퇴한 학생의 이름" })
  @Column()
  username: string;

  @ApiProperty({ description: "조퇴한 학생의 학년" })
  @Column()
  grade: number;

  @ApiProperty({ description: "조퇴한 학생의 반" })
  @Column()
  class: number;

  @ApiProperty({ description: "조퇴한 학생의 번호" })
  @Column()
  s_number: number;

  @ApiProperty({ description: "조퇴 시작 시간" })
  @Column()
  start_time: string;

  @ApiProperty({ description: "조퇴 이유" })
  @Column()
  reason: string;

  @ApiProperty({ description: "조퇴 승인의 여부" })
  @Column()
  request: number;
}
