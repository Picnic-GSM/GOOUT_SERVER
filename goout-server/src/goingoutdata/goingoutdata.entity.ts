import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goingoutdata {
  @PrimaryGeneratedColumn()
  goingid: number;

  @Column()
  grade: number;

  @Column()
  class:number;

  @Column()
  s_number:number;

  @Column()
  start_time:string;

  @Column()
  end_time:string;

  @Column()
  reason:string;

  @Column()
  going_status:string;
}