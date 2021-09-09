import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Goingoutdata {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "외출 정보 id" })
  goingid: number;

  @ApiProperty({ description: "외출한 학생 학년" })
  @Column()
  grade: number;

  @ApiProperty({ description: "외출한 학생 반" })
  @Column()
  class: number;

  @ApiProperty({ description: "외출한 학생 번호" })
  @Column()
  s_number: number;

  @ApiProperty({ description: "외출 시작 시간" })
  @Column()
  start_time: string;

  @ApiProperty({ description: "외출 끝나는 시간" })
  @Column()
  end_time: string;

  @ApiProperty({ description: "외출 사유" })
  @Column()
  reason: string;

  @ApiProperty({ description: "외출 상태" })
  @Column()
  going_status: string;

  @ApiProperty({ description: "외출 허가 여부" })
  @Column()
  request: number;

  @ApiProperty({ description: "학교로 돌아오는 것 확인" })
  @Column()
  back_check: number;
}
