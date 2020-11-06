import {Arg, Authorized, Query, Resolver} from "type-graphql";
import { User } from "@domain/users/entities";
import { UserService } from "@domain/users/services";
import {Service} from "typedi";

@Service()
@Resolver(User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Authorized('ADMIN')
    @Query(() => [User])
    async getUsers() {
        return await this.userService.getUsers();
    }

    @Query(() => User)
    async getUser(@Arg('id') userId: string) {
        return await this.userService.findOnyById(userId);
    }

}
