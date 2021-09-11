import { Config } from 'apollo-server'

import { CatsAPI } from './datasources/cats'
import { DynamoDBDataSource } from './datasources/dynamodb'

import { resolvers } from './resolvers'

import { UserExt } from './types';
import { readFileSync } from 'fs';

export interface ApolloContext {
    context: any
    event: any
}

export function createConfig(env: any, getUser : (ctx: ApolloContext) => UserExt): Config {
    const typeDefs = readFileSync('./schema.graphql', 'utf-8');

    return {
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
            return {
                user: getUser(ctx)
            };
        }
    };
}
