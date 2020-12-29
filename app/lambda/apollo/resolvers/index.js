"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const cats_1 = require("./cats");
// import { UserOps } from './user'
exports.resolvers = {
    Query: {
        me: (_, __, { user }) => user,
        cats: () => ({})
    },
    Cats: cats_1.Cats,
    // UserOps,
    Mutation: {
        user: () => ({})
    }
};
