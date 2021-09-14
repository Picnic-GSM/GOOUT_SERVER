import { ApiProperty } from "@nestjs/swagger";
import { Student } from "src/user/entites/student.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Out {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "외출 정보 id" })
  idx: number;

  @OneToMany((type) => Student, (student) => student.idx)
  user_id: number;

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
  @Column("enum", { default: 1 })
  status: Status;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;
}

enum Status {
  Disapproved = 1,
  Rejected = 2,
  Approved = 3,
  Returned = 4,
}
