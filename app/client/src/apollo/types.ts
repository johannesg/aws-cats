/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Cat = {
  __typename?: 'Cat';
  id: Scalars['ID'];
  url: Scalars['String'];
  height?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
};

export type Cats = {
  __typename?: 'Cats';
  random?: Maybe<Array<Maybe<Cat>>>;
};


export type CatsRandomArgs = {
  pageSize?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  cats?: Maybe<Cats>;
  me?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  )> }
);

export type GetRandomCatsQueryVariables = Exact<{
  pageSize?: Maybe<Scalars['Int']>;
}>;


export type GetRandomCatsQuery = (
  { __typename?: 'Query' }
  & { cats?: Maybe<(
    { __typename?: 'Cats' }
    & { random?: Maybe<Array<Maybe<(
      { __typename?: 'Cat' }
      & Pick<Cat, 'url'>
    )>>> }
  )> }
);


export const MeDocument = gql`
    query me {
  me {
    id
    email
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetRandomCatsDocument = gql`
    query getRandomCats($pageSize: Int) {
  cats {
    random(pageSize: $pageSize) {
      url
    }
  }
}
    `;

/**
 * __useGetRandomCatsQuery__
 *
 * To run a query within a React component, call `useGetRandomCatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRandomCatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRandomCatsQuery({
 *   variables: {
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useGetRandomCatsQuery(baseOptions?: Apollo.QueryHookOptions<GetRandomCatsQuery, GetRandomCatsQueryVariables>) {
        return Apollo.useQuery<GetRandomCatsQuery, GetRandomCatsQueryVariables>(GetRandomCatsDocument, baseOptions);
      }
export function useGetRandomCatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRandomCatsQuery, GetRandomCatsQueryVariables>) {
          return Apollo.useLazyQuery<GetRandomCatsQuery, GetRandomCatsQueryVariables>(GetRandomCatsDocument, baseOptions);
        }
export type GetRandomCatsQueryHookResult = ReturnType<typeof useGetRandomCatsQuery>;
export type GetRandomCatsLazyQueryHookResult = ReturnType<typeof useGetRandomCatsLazyQuery>;
export type GetRandomCatsQueryResult = Apollo.QueryResult<GetRandomCatsQuery, GetRandomCatsQueryVariables>;