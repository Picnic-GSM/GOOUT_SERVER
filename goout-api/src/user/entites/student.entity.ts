import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column({ length: 45 })
  password: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column("tinyint")
  grade: number;

  @Column("tinyint")
  class: number;

  @Column("tinyint")
  s_number: number;

  @Column({default:false})
  is_active: boolean;
}
