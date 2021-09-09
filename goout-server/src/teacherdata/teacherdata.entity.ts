import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export class Teacherdata {
    @PrimaryColumn()
    tracherid:number;

    @Column()
    teachercode:string;

    @Column()
    grade:number;

    @Column()
    class:number;
}