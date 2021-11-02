import { Resolvers } from '../types';
import { Cats } from './cats'

// import { UserOps } from './user'

export const resolvers : Resolvers = {
    Query: {
        // me: async (_, __, { user, dataSources: { DynamoDB} }) => await DynamoDB.getUser() ?? user,
        me: async (_, __, { user }) => user,
        cats: () => ({}),
        hello: () => "Hello V3"
    },

    Cats,

    // UserOps,

    Mutation: {
        // updateUser: async (_, { params }, { user, dataSources: { DynamoDB } }) => {
        //     const { firstName, lastName } = params;
        //     await DynamoDB.putUser(firstName, lastName);
        //     return await DynamoDB.getUser() ?? user;
        // }
    }
};
