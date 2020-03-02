
import { buildTypeDefsAndResolvers } from 'type-graphql';
import * as graphqlHTTP from 'express-graphql';
import { makeExecutableSchema } from "graphql-tools";
import { UserResolver } from './resolvers/User';
import * as express from "express";

async function getRouter() {
  const router = express.Router();
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [UserResolver],
  });
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  router.use(
    "/",
    graphqlHTTP(async (request, response, graphQLParams) => ({
      schema,
      context: {request, response},
      graphiql: true
    })),
  );
  return router;
}

export default getRouter;