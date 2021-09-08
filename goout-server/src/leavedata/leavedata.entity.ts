import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Leavedata {
  @PrimaryGeneratedColumn()
  leaveid: number;

  @Column()
  username: string;

  @Column()
  grade: number;

  @Column()
  class: number;

  @Column()
  s_number: number;

  @Column()
  start_time: string;

  @Column()
  reason: string;
}
