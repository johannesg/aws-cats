
import { gql } from "apollo-server-lambda"

export default gql`
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