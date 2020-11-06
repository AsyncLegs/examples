import {Service} from "typedi";
import {Arg, Mutation, Resolver} from "type-graphql";
import {RegisterDto, LoginDto, UserResponseDto} from "@domain/auth/dto";
import { UserService } from "@domain/users/services";
import { AuthService } from "@domain/auth/services";
import {TokenResponseDto} from "@domain/auth/dto";

@Service()
@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Mutation(() => TokenResponseDto)
    async login(@Arg('payload') payload: LoginDto) {
        return this.authService.login(payload);
    }

    @Mutation(() => UserResponseDto)
    async register(
        @Arg('payload') payload: RegisterDto,
    ) {
        const {email, password} = payload;
        return await this.userService.create(email, password);
    }
}
