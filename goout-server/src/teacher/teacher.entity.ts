import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Teacher {
  @PrimaryColumn()
  id: number;

  @Column()
  teachercode: number;

  @Column()
  grade: number;

  @Column()
  class: number;
}
