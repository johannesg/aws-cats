import { ApolloProvider } from '@apollo/client';
import * as React from 'react'
import { configure, createApolloClient } from '../../src/apollo/client';

export function onClientEntry(_, { baseUrl }) {
}

export const wrapRootElement = ({ element }, { baseUrl }) => {
    configure({ baseUrl });


    var client = createApolloClient("");
    return <ApolloProvider client={client}>{element}</ApolloProvider>;
};