import { ApolloServer } from 'apollo-server-azure-functions';
import { ApolloContext, createConfig } from './config';
import { UserExt } from "./types";
// const env = require('./env.json');

function getFakeUser(ctx: ApolloContext): UserExt {
    // throw new ApolloError("testing");
    return {
        groups: ["Admin"],
        id: "kalle",
        email: "olle"
    };
}

const server = new ApolloServer(createConfig({}, getFakeUser));
export const handler = server.createHandler({});