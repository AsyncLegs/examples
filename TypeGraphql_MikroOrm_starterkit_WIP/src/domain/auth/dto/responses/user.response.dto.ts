import {Field, ObjectType} from "type-graphql";
import {Role} from "@domain/users/types";

@ObjectType()
export class UserResponseDto {
    @Field()
    id: string;

    @Field()
    email: string;

    @Field()
    role: Role;
}
