import {MikroORM} from "@mikro-orm/core";
export default {
    debug: true,
    strict: true,
    migrations: {
        path: './migrations',
        tableName: 'migrations',
        transactional: true,
    },
    dbName: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],
    type: 'postgresql',
    forceUtcTimezone: true,
    discovery: {
        warnWhenNoEntities: false
    }
} as Parameters<typeof MikroORM.init>[0];
