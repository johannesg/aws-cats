"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
exports.default = apollo_server_lambda_1.gql `
    schema {
        query: Query
        # mutation: Mutation
    }

    type Query {
        cats: Cats
        me: User
    }

    # type Mutation {
        # user: UserOps
        # registerUser(email: String!, password: String!): AuthPayload
        # login(email: String!, password: String!): AuthPayload
    # }

    type User {
        id: ID!
        email: String!
    }

    type Cat {
        id: ID!
        url: String!
        height: Int
        width: Int
    }

    type Cats {
        random(pageSize: Int = 10): [Cat]
    }
`;
