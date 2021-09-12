import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/student/userdata.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "조퇴 id" })
  id: number;

  @OneToMany(type=>Student, student => student.id)
  user_id:number;

  @ApiProperty({ description: "조퇴 시작 시간" })
  @Column()
  start_at: string;

  @ApiProperty({ description: "조퇴 이유" })
  @Column()
  reason: string;

  @ApiProperty({ description: "조퇴 승인의 여부 및 상태" })
  @Column()
  status: string;

  created_at:Date;
}
