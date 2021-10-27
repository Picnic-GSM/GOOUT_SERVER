import { Connection } from 'typeorm';
import { Out } from './entities/out.entity';

export const outProviders = [
    {
        provide: 'OUT_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Out),
        inject: ['DATABASE_CONNECTION'],
    },
];
