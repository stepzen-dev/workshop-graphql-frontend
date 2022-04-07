import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(
  'https://graphql07.stepzen.net/api/0777b07452dfe5d76ce46a4fecb3918d/__graphql',
  { headers: {} },
);

export default client;
