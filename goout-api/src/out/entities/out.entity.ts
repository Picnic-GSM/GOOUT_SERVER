import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/user/entites/student.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { OutStatus } from "../enum";

enum Status {
  Disapproved = 1,
  Rejected = 2,
  Approved = 3,
  Returned = 4,
}

@Entity()
export class Out {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "외출 정보 id" })
  idx: number;

  @ApiProperty({ description: "외출 시작 시간" })
  @Column("datetime")
  start_at: Date;

  @ApiProperty({ description: "외출 끝나는 시간" })
  @Column("datetime")
  end_at: Date;

  @ApiProperty({ description: "외출 사유" })
  @Column({ length: 200 })
  reason: string;

  @ApiProperty({ description: "외출 상태 및 허가여부" })
  @Column("enum", { enum: OutStatus, default: OutStatus.Disapproved })
  status: OutStatus;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @ManyToOne((type) => Student, (student) => student.out)
  student: Student;
}
