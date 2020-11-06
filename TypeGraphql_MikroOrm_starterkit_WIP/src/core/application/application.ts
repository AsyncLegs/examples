import {getApolloServerInstance, getGraphQlSchema, registerEnums} from "@core/graphql";
import {ApolloServer} from "apollo-server";
import {initDatabase} from "@core/database";

export class Application {
    private server: ApolloServer;

    private async initGraphQL() {
        try {
            registerEnums();
            const schema = await getGraphQlSchema();
            const orm = await initDatabase();
            this.server = await getApolloServerInstance(schema, orm);
        } catch (e) {
            console.error(e);
        }

    }

    public async bootstrap() {
        await this.initGraphQL();
    }


    public async run() {
        const { url } = await this.server.listen(3000);
        console.log(`Server is running, GraphQL Playground available at ${url}`);
    }

    public async stop() {
        console.log(`Stopping application...`);
        await this.server.stop();
        process.exit(1);
    }
}
