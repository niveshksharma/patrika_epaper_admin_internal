import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
    uri: 'https://middleware.patrika.com/graphql',
});

const errorLink = onError(({ error }) => {
    //   if (error) {
    //     error.forEach(({ message, locations, path }) =>
    console.log(
        `[GraphQL error]: Message: ${error}`
    )
    //     );
    //   }
    //   if (networkError) {
    //     console.error(`[Network error]: ${networkError}`);
    //   }
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});
