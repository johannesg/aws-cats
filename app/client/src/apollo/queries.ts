import gql from 'graphql-tag';

const QUERIES = gql`
    query me {
        me {
            id
            email
        }
    }
    query getRandomCats($pageSize: Int) {
        cats {
            random(pageSize: $pageSize) {
                id
                url
            }
        }
    }
`;

export const Queries = {
    QUERIES
}