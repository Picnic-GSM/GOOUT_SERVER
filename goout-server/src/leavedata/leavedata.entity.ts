import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "조퇴 id" })
  id: number;

  user_id:number;

  @ApiProperty({ description: "조퇴 시작 시간" })
  @Column()
  start_at: string;

  @ApiProperty({ description: "조퇴 이유" })
  @Column()
  reason: string;

  @ApiProperty({ description: "조퇴 승인의 여부" })
  @Column()
  status: string;

  created_at:Date;
}
