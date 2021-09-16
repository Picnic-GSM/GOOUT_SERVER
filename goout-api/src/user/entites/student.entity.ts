import { Leave } from "src/leave/entites/leave.entity";
import { Out } from "src/out/entities/out.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ length: 45 })
  name: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column("tinyint")
  grade: number;

  @Column("tinyint")
  class: number;

  @Column("tinyint")
  s_number: number;

  @Column({ default: false })
  is_active: boolean;

  @OneToMany((type) => Out, (out) => out.student)
  out: Out[];

  @OneToMany((type) => Leave, (leave) => leave.student)
  leave: Leave[];
}
