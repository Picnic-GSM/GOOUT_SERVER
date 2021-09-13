import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Teacher {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  grade: number;

  @Column()
  class: number;

  @Column()
  activateCode: number;

  @Column()
  is_active: boolean;
}
