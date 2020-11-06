import {Field, InputType} from "type-graphql";
import {IsEmail, Length} from "class-validator";
import {IsUserUnique} from "@domain/users/validation/is.user.unique.validator";
import {UserInterface} from "@domain/users/types";

@InputType()
export class RegisterDto implements Partial<UserInterface> {
    @Field()
    @IsEmail()
    @IsUserUnique()
    email: string;

    @Field()
    @Length(6)
    password: string;
}
