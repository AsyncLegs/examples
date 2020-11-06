import { ContainerInstance } from "typedi";
import {LogLevels} from "@core/types/enums";

export interface LoggerInterface {
    level: LogLevels
    requestId: string;
}


export interface Context {
    requestId: string;
    container: ContainerInstance;
    token?: string;
    authUserId?: string;
}
