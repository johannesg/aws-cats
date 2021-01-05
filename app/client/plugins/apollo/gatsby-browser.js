/* eslint-disable import/prefer-default-export, react/prop-types */
import React from 'react';

import { ApolloProvider } from '@apollo/client'

export const wrapRootElement = ({ element }) => {
    return <TopLayout>{element}</TopLayout>;
};