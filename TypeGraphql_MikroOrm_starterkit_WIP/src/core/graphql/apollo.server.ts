import {ApolloServer as Server} from "apollo-server";
import {Context} from "@core/types";
import {v4} from "uuid";
import {Container, ContainerInstance} from "typedi";
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {useContainer} from "class-validator";
import {ApolloServerPlugin, GraphQLRequestContext} from "apollo-server-plugin-base";
import {GraphQLSchema} from "graphql";

export const getApolloServerInstance = async (schema: GraphQLSchema, orm: MikroORM) => {
    return new Server({
        schema,
        tracing: true,
        debug: true,
        context: ({req}): Context => {
            const requestId = v4();
            console.log('requestId: ', requestId);
            const container = Container.of(requestId); // get scoped container
            const token = req.headers?.authorization?.split(' ')[1];

            const context = {requestId, container, token}; // create our context

            container.set("context", context); // place context or other data in container
            const forkedEntityManager = orm.em.fork(true, true);
            container.set(EntityManager, forkedEntityManager);
            useContainer(container);

            return context;
        },
        plugins: [
            {
                requestDidStart: () => ({
                    willSendResponse(requestContext: GraphQLRequestContext<Context>) {
                        // remember to dispose the scoped container to prevent memory leaks
                        Container.reset(requestContext.context.requestId);

                        // for developers curiosity purpose, here is the logging of current scoped container instances
                        // we can make multiple parallel requests to see in console how this works
                        const instancesIds = ((Container as any).instances as ContainerInstance[]).map(
                            instance => instance.id,
                        );
                        console.log("instances left in memory:", instancesIds);
                    },
                }),
            },
        ] as ApolloServerPlugin[],
    })
};
