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

  @Column({default:false})
  is_active: boolean;
}
