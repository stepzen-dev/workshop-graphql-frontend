import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(
  'https://graphqlbf.stepzen.net/api/bf215181b5140522137b3d4f6b73544a/__graphql',
  { headers: {} },
);

export default client;
