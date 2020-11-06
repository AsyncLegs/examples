import {Service} from "typedi";
import {LoginDto} from "@domain/auth/dto";
import {JwtService} from "@domain/auth/services/jwt.service";
import {verify} from "argon2";
import {UserService} from "@domain/users/services";
import { AuthenticationError } from "apollo-server";

@Service()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {
    }


    async login(payload: LoginDto) {
        const {email, password} = payload;
        const user = await this.userService.findOnyByEmail(email);
        if (!user) {
            throw new AuthenticationError(`Login failed.`)
        }

        const isPasswordValid = await verify(user.password, password);

        if (!isPasswordValid) {
            throw new AuthenticationError(`Login failed.`)
        }

        return { token: this.jwtService.sign({userId: user.id}) };
    }

    async logout() {

    }
}
