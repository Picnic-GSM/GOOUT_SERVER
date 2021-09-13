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
  id: number;

  @OneToMany((type) => Student, (student) => student.id)
  user_id: number;

  @ApiProperty({ description: "외출 시작 시간" })
  @Column()
  start_at: string;

  @ApiProperty({ description: "외출 끝나는 시간" })
  @Column()
  end_at: string;

  @ApiProperty({ description: "외출 사유" })
  @Column()
  reason: string;

  @ApiProperty({ description: "외출 상태 및 허가여부" })
  @Column()
  status: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
