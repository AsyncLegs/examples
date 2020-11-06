import { LoggerInterface } from "@core/types/interfaces";
import { LogLevels } from "@core/types/enums";
import pino from 'pino';
import { Service } from "typedi";

@Service()
export class Logger implements LoggerInterface {
    level: LogLevels;
    requestId: string;
    private readonly transport = pino({
        name: 'goodplant-api',
        level: 'info'
    });
    constructor() {
        console.log(this.transport);
    }
}
