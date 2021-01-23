import 'graphql-import-node';
import { ApolloError, ApolloServer } from "apollo-server-lambda"

import { CatsAPI } from './datasources/cats'
import { DynamoDBDataSource } from './datasources/dynamodb'

import typeDefs from './schema.graphql'
import { resolvers } from './resolvers'

import { UserExt } from './types';

// require("./datasources/dynamodb");

console.log(`Starting up`);

function getFakeUser(req: any) : UserExt {
    // throw new ApolloError("testing");
    return { 
        groups: ["Admin"],
        id: "kalle", 
        email: "olle"
    };
}

function getUserFromClaims(claims: Record<string, string>) : UserExt {
    const groups = claims['cognito:groups'].split(',');
    return {
        groups,
        email: claims.email,
        id: claims['cognito:username'],
        sub: claims.sub,
        email_verified: claims.email_verified,
        phone_number_verfied: claims.phone_number_verfied,
        iss: claims.iss,
        aud: claims.aud,
        event_id: claims.event_id,
        token_use: claims.token_use,
        auth_time: claims.auth_time,
        exp: claims.exp,
        iat: claims.iat
    }
}

interface ApolloContext {
    context: any
    event: any
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            // UserAPI: new UserAPI(containers.users),
            CatsAPI: new CatsAPI(),
            DynamoDB: new DynamoDBDataSource()
        }
    },
    context: (ctx : ApolloContext) => {
        const { event} = ctx;
        // console.log(ctx);
        const claims = event.requestContext?.authorizer?.claims;
        const user = claims !== null && claims !== undefined 
            ? getUserFromClaims(claims)
            : getFakeUser(event);

        return {
            user
        };
    },
    plugins: [
        {
            async serverWillStart() {
                // containers = await initCosmos();
            }
        }
    ]

});

console.log(`Init complete. Node version: ${process.version}`);

export const handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    }
});