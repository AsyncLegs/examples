import {MikroORM} from "@mikro-orm/core";
import databaseConfig from './config';
export const initDatabase = async () => {
    return await MikroORM.init(databaseConfig);
};
