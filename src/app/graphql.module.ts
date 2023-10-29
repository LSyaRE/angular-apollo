import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { FragmentDefinitionNode, OperationDefinitionNode } from 'graphql';

const uri = 'http://localhost:3000/graphql'; 
const wsUri = 'ws://localhost:3000/graphql'; 

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

interface Definition {
  kind: string;
  operation?: string;
};




@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink): ApolloClientOptions<any>
      {
        // Create an http link:
        const http = httpLink.create({
          uri: 'http://localhost:3000/graphql',
        });
 
        const cache: InMemoryCache = new InMemoryCache();

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: wsUri,
          options: {
            reconnect: true,
          },
        });
 
        // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        const link = split(
          // split based on operation type
          ({ query }) => {
            const { kind, operation } : Definition = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
          },
          ws,
          http,
        );
 
        return {
          link,
          cache,

        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
