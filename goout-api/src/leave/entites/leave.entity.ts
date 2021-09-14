import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/user/entites/student.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "조퇴 id" })
  idx: number;

  @OneToMany((type) => Student, (student) => student.idx)
  user_id: number;

  @ApiProperty({ description: "조퇴 시작 시간" })
  @Column("datetime")
  start_at: Date;

  @ApiProperty({ description: "조퇴 이유" })
  @Column({ length: 100 })
  reason: string;

  @ApiProperty({ description: "조퇴 승인의 여부 및 상태" })
  @Column("enum")
  status: LeaveStatus;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}

enum LeaveStatus {
  DisApproved = 1,
  Approved = 2,
  Rejected = 3,
}
