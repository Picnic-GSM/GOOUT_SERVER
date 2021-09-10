import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  grade: number;

  @Column()
  class: number;

  @Column()
  s_number: number;

  @Column()
  is_active:number;
}
