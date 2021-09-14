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

<<<<<<< HEAD
  @Column({ default: false })
=======
  @Column({default:false})
>>>>>>> 85f81cc4b6bbd47da1a0d08c6369a4fdabf7449d
  is_active: boolean;
}
