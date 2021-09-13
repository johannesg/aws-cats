import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client'

import { cache } from './cache'

let _baseUrl = "";

export function configure({ baseUrl }: { baseUrl: string}) {
    _baseUrl = baseUrl;
}

export function createApolloClient(token: string) {
    return new ApolloClient({
        cache,
        uri: _baseUrl,
        headers: {
            authorization: token
        }
    });
}
    
