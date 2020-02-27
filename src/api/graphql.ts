import { User } from "../database/user.model";
import { makeExecutableSchema } from "graphql-tools";
import * as graphqlHTTP from 'express-graphql';
import * as express from "express";

const router = express.Router();

const typeDefs = `
type User{
  email:String,
  password:String,
  name:String,
  phone_number:String,
  admin:Boolean
}

type Query {
  users: [User]!
  user(email: String!): User
}

type Mutation {
  deleteUser(email: String!): User
  updateUser(email: String!, name: String, phone_number: String): User
}
`;

const resolvers = {
  Query: {
    users: async () => {
      const result = await User.findAll();
      return result;
    },
    user: async (_: any, args: object, root: any) => {
      console.log(root.session)
      const result = await User.findOne({where: {email: args["email"]}});
      return result;
    }
  },
  Mutation: {
    deleteUser: async (_: any, args: object) => {
      await User.destroy({
        where: args["email"]
      })
      return {id: args["email"]};
    },
    updateUser: async (_: any, args: object) => {
      const data = {};
      if(args["name"]) data["name"] =args["name"];
      if(args["phone_number"]) data["name"] =args["name"];

      await User.update(data, {
        where: {id: args["email"]}
      })
      return {id: args["email"]};
    }
  }
}
  
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

router.use(
  "/",
  graphqlHTTP(async (request, response, graphQLParams) => ({
    schema: schema,
    rootValue: request,
    graphiql: true
  })),
);

module.exports = router;
