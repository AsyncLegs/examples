import {Service} from "typedi";

@Service()
export class Config {
    static readonly ROOT_PATH: string = process.cwd();
    get<T = string>(key: string): T {
        return (process.env[key] as unknown) as T;
    }
}
