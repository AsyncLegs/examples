import {AuthChecker} from "type-graphql";
import {Context} from "@core/types";
import {JwtService} from "@domain/auth/services/jwt.service";
import {UserService} from "@domain/users/services";

export const authChecker: AuthChecker<Context> = async (
    {context},
    roles,
) => {

    const { token, container} = context;
    const authService = container.get(JwtService);
    const userService = container.get(UserService);
    try {
        const payload = authService.verify(token);
        const user = await userService.findOnyById(payload.userId!);
        if (user) {
            context.authUserId = user.id;
        }

        return roles.some(role => user?.role?.includes(role));
    } catch (e) {
        console.error(e);
        return false;
    }
};
