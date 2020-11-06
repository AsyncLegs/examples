import {Role} from "@domain/users/types/enums";

export interface UserInterface {
    id: string;
    email: string;
    role: Role;
}
