
import { ApolloServer } from "apollo-server-lambda"

// const { initCosmos } = require("./datasources/cosmosdb");
// const { UserAPI } = require("./datasources/user");
import { CatsAPI } from './datasources/cats'
// const { verifyToken } = require('./utils/jwt');

import typeDefs from './schema'
import { resolvers } from './resolvers'

// require("./datasources/dynamodb");

// let containers = {};

console.log(`Starting up`);

function getUserFromToken(req: any) {
    const Authorization = req.headers.Authorization;
    if (Authorization) {
        // const token = Authorization.replace('Bearer ', '');
        // const user = verifyToken(token);
        return { id: "kalle", email: "olle" };
    }
    return null;
}

function getUserFromClaims(claims: Record<string, string>) {
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
            CatsAPI: new CatsAPI()
        }
    },
    context: (ctx : ApolloContext) => {
        const { context, event} = ctx;
        // console.log(`Context: ${ctx}`);
        console.log(ctx);
        // console.log(event.requestContext?.authorizer?.claims);
        const claims = event.requestContext?.authorizer?.claims;
        if (claims !== null && claims !== undefined) {
            const user = getUserFromClaims(claims)
            console.log(user);
            return {
                user
            }
        }
        return {
            user: getUserFromToken(event)
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

export const handler = server.createHandler();