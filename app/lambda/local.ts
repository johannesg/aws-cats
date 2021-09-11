import { ApolloServer } from 'apollo-server';
import { ApolloContext, createConfig } from './config';
import { UserExt } from "./types";
// const env = require('./env.json');
const port = 3000;

function getFakeUser(ctx: ApolloContext): UserExt {
    // throw new ApolloError("testing");
    return {
        groups: ["Admin"],
        id: "kalle",
        email: "olle"
    };
}

const server = new ApolloServer(createConfig({}, getFakeUser));

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});