import { Connection } from 'typeorm';
import { Student } from './entites/student.entity';
import { Teacher } from './entites/teacher.entity';

export const studentProviders = [
    {
        provide: 'STUDENT_REPOSITORY',
        useFactory: (connection: Connection) =>
            connection.getRepository(Student),
        inject: ['DATABASE_CONNECTION'],
    },
];

export const teacherProviders = [
    {
        provide: 'TEACHER_REPOSITORY',
        useFactory: (connection: Connection) =>
            connection.getRepository(Teacher),
        inject: ['DATABASE_CONNECTION'],
    },
];
