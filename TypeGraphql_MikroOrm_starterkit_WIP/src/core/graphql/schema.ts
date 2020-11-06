import {buildSchema, ResolverData} from "type-graphql";
import {UserResolver} from "@domain/users/resolvers";
import {Context} from "@core/types";
import {Container} from "typedi";
import {AuthResolver} from "@domain/auth/resolvers";
import {authChecker} from "@core/graphql/extensions";

export const getGraphQlSchema = async () => await buildSchema({
    resolvers: [UserResolver, AuthResolver],
    container: (({context}: ResolverData<Context>) => Container.of(context.requestId)),
    dateScalarMode: "timestamp",
    authChecker,
});
