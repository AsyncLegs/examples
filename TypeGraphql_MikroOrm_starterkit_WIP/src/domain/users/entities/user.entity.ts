import { Entity, Enum, Property, Unique } from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {Role} from "@domain/users/types/enums";
import {UserInterface} from "@domain/users/types";
import {Base} from "@core/database";

@ObjectType()
@Entity({ tableName: 'users' })
export class User extends Base implements UserInterface{

    @Property({type: String})
    @Field()
    @Unique()
    email: string;

    @Property({
        type: String
    })
    @Field()
    password: string;

    @Property({type: Number, version: true})
    @Field()
    version!: number;


    @Enum(() => Role)
    @Field(() => Role)
    role: Role = Role.MEMBER;
}
