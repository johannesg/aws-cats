import { ApolloError, ApolloServer } from "apollo-server-lambda"

import { UserExt } from './types';

import { ApolloContext, createConfig } from './config';

// require("./datasources/dynamodb");

console.log(`Starting up`);

function getUserFromClaims(ctx: ApolloContext): UserExt {
    const { event } = ctx;
    // console.log(ctx);
    const claims = event.requestContext?.authorizer?.claims ?? {};
    // console.log(claims);
    const groups = (claims['cognito:groups'] ?? "").split(',');
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

const server = new ApolloServer(createConfig({}, getUserFromClaims));

console.log(`Init complete. Node version: ${process.version}`);

export const handler = server.createHandler({});