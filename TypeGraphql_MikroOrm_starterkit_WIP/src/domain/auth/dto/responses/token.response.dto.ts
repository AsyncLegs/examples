import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class TokenResponseDto {
    @Field()
    token: string;
}
