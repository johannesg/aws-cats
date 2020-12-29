
import { gql } from "apollo-server-lambda"

// const UserResolvers = import("./resolvers/user");

export default gql`
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

    type Query {
        cats: Cats
        me: User
    }

    input CredentialsInput {
        email: String!
        password: String!
    }

    type AuthPayload {
        token: String
        user: User
    }

    type UserOps {
        register(email: String!, password: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
    }

    type Mutation {
        user: UserOps
        # registerUser(email: String!, password: String!): AuthPayload
        # login(email: String!, password: String!): AuthPayload
    }
`;