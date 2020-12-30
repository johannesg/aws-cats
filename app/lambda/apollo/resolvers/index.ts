import { Context, Resolvers } from '../types';
import { IResolvers } from 'graphql-tools';
import { Cats } from './cats'

// import { UserOps } from './user'

export const resolvers : Resolvers = {
    Query: {
        me: (_, __, { user }) => user,
        cats: () => ({})
    },

    Cats,

    // UserOps,

    // Mutation: {
    //     user: () => ({})
    // }
};
