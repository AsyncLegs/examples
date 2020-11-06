import { registerEnumType } from "type-graphql";
import {Role} from "@domain/users/types";

export const registerEnums = () => {
    registerEnumType(Role, {
        name: 'Role',
    });
};
