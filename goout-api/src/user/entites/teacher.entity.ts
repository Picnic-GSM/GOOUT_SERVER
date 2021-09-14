import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Teacher {
  @PrimaryColumn()
  idx: number;

  @Column({ length: 45 })
  name: string;

  @Column()
  grade: number;

  @Column()
  class: number;

  @Column("tinyint")
  activateCode: number;

  @Column()
  is_active: boolean;
}
