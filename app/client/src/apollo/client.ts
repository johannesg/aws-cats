import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client'

import { cache } from './cache'

export function createApolloClient(token: string) {
    return new ApolloClient({
        cache,
        // uri: "http://localhost:3000",
        uri: "https://catsapi.aws.jogus.io/graphql",
        headers: {
            authorization: token
        }
    });
}
    
