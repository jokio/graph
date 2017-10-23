import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import fileLoader from '../common/loader';
import * as path from 'path';

const typeDefs = fileLoader(path.join(__dirname, '../../src/schema'), { recursive: true, patternString: '\.gql' });
const resolvers = fileLoader(__dirname, { recursive: true, patternString: 'resolvers\.' });

const executableSchema = makeExecutableSchema({
    typeDefs: mergeTypes(typeDefs),
    resolvers: mergeResolvers(resolvers),
});

export default executableSchema;
