import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
import * as fs from 'fs';

const typeDefs = fs.readFileSync(__dirname + '/schema.gql').toString();

export default {
    typeDefs,
    resolvers
}