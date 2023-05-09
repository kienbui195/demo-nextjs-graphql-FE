import {gql} from '@apollo/client'

export const GET_BOOKS_AUTHORS = gql`
query {
    books {
      name
    }
    authors {
      name
    }
}
`