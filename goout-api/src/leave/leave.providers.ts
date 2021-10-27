import { Connection } from 'typeorm';
import { Leave } from './entites/leave.entity';

export const leaveProviders = [
    {
        provide: 'LEAVE_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Leave),
        inject: ['DATABASE_CONNECTION'],
    },
];
