import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import fileLoader from '../common/loader';

const typeDefs = fileLoader(__dirname, { recursive: true, patternString: '\.gql' });
const resolvers = fileLoader(__dirname, { recursive: true, patternString: 'resolvers\.ts' });

const executableSchema = makeExecutableSchema({
    typeDefs: mergeTypes(typeDefs),
    resolvers: mergeResolvers(resolvers),
});

export default executableSchema;
