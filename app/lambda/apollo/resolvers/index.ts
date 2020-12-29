import { Context } from '../types';
import { Cats } from './cats'

// import { UserOps } from './user'

export const resolvers = {
    Query: {
        me: (_ : any, __ : any, { user } : Context ) => user,
        cats: () => ({})
    },

    Cats,

    // UserOps,

    Mutation: {
        user: () => ({})
    }
};
