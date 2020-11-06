// import {GraphQLExtension, GraphQLResponse} from 'graphql-extensions';
// import {formatApolloErrors} from 'apollo-server-errors';
// import {GraphQLError, GraphQLFormattedError} from 'graphql';
// import icepick from 'icepick';
// import {Logger} from "@core/logger";
//
// const filterOutErrorPaths = [
//     ['extensions', 'exception', 'options', 'auth', 'bearer'],
//     [
//         'extensions',
//         'exception',
//         'response',
//         'request',
//         'headers',
//         'authorization',
//     ],
// ];
//
// function errSerializer(error: GraphQLError) {
//     if (error == null) {
//         return error;
//     }
//     let err = icepick.dissoc(error, 'nodes');
//     for (let i = 0; i < filterOutErrorPaths.length; i++) {
//         if (icepick.getIn(err, filterOutErrorPaths[i])) {
//             err = icepick.dissocIn(err, filterOutErrorPaths[i]);
//         }
//     }
//     return err;
// }
//
// export function logGraphQLError(
//     log: Logger,
//     error: GraphQLError
// ): GraphQLFormattedError {
//     if (error.extensions && error.extensions.logged === true) {
//         return error;
//     }
//
//     if (!error.extensions || error.extensions.logged !== true) {
//         const {message: Message = 'An unknown error occurred.'} = error;
//         const err = errSerializer(error);
//         const Code =
//             (error.extensions && error.extensions.code) ||
//             'INTERNAL_SERVER_ERROR_NOT_ENRICHED';
//         // log
//         //     .child({SourceContext: 'graphql'}, true)
//         //     .error({err, Message, Code}, '{Code} in GraphQL Server: {Message}');
//
//         if (error.extensions) {
//             icepick.setIn(error, ['extensions', 'logged'], true);
//         }
//     }
//
//     return error;
// }
//
// export class LoggingExtension<TContext extends { log: Logger } = any> extends GraphQLExtension<TContext> {
//     private readonly debug: boolean;
//
//     constructor(debug: boolean = false) {
//         super();
//         this.debug = debug;
//     }
//
//     public willSendResponse(o: {
//         graphqlResponse: GraphQLResponse;
//         context: TContext;
//     }): void | { graphqlResponse: GraphQLResponse; context: TContext } {
//         if (o.graphqlResponse.errors) {
//             const errors = formatApolloErrors(o.graphqlResponse.errors, {
//                 formatter: logGraphQLError.bind(null, o.context.log),
//                 debug: this.debug,
//             });
//             return {
//                 ...o,
//                 graphqlResponse: {
//                     ...o.graphqlResponse,
//                     errors,
//                 },
//             };
//         }
//     }
// }
