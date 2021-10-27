import { ApiProperty } from '@nestjs/swagger';
import { Student } from 'src/user/entites/student.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { LeaveStatus } from '../enum';

@Entity()
export class Leave {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: '조퇴 id' })
    idx: number;

    @ApiProperty({ description: '조퇴 시작 시간' })
    @Column('datetime')
    start_at: Date;

    @ApiProperty({ description: '조퇴 이유' })
    @Column({ length: 100 })
    reason: string;

    @ApiProperty({ description: '조퇴 승인의 여부 및 상태' })
    @Column('enum', { enum: LeaveStatus, default: LeaveStatus.DisApproved })
    status: LeaveStatus;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    created_at: Date;

    @ManyToOne((type) => Student, (student) => student.leave)
    student: Student;
}
