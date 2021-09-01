import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Userdata {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column()
  username: string;

  @Column()
  password:string;

  @Column()
  email:string;

  @Column()
  grade:number;

  @Column()
  class:number;
}