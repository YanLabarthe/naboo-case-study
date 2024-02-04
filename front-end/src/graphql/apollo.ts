import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const graphqlClient = new ApolloClient({
  link: errorLink.concat(
    new HttpLink({
      uri: "http://localhost:3000/graphql",
      credentials: "include",
    })
  ),
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined",
});
