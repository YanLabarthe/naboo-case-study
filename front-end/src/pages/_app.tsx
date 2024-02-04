import { Topbar } from "@/components";
import { AuthProvider, SnackbarProvider } from "@/contexts";
import { routes } from "@/routes";
import { graphqlClient } from "@/graphql/apollo";
import { mantineTheme } from "@/utils";
import { ApolloProvider } from "@apollo/client";
import { Container, MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/contexts/favoriteContext";
import { ActivityProvider } from "@/contexts/activityContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
      <SnackbarProvider>
        <ApolloProvider client={graphqlClient}>
          <AuthProvider>
            <ActivityProvider>
              <FavoritesProvider>
                <Topbar routes={routes} />
                <Container>
                  <Component {...pageProps} />
                </Container>
              </FavoritesProvider>
            </ActivityProvider>
          </AuthProvider>
        </ApolloProvider>
      </SnackbarProvider>
    </MantineProvider>
  );
}
