import { buildTypeDefsAndResolvers } from 'type-graphql';
import graphqlHTTP from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import express from 'express';
import UserResolver from './resolvers/User';

async function getRouter() {
  const router = express.Router();
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [UserResolver],
  });
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  router.use(
    '/',
    graphqlHTTP(async (request, response) => ({
      schema,
      context: { request, response },
      graphiql: true,
    })),
  );
  return router;
}

export default getRouter;
