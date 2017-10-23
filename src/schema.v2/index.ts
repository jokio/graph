import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import music from './music';
import user from './user';



const typeDefs = mergeTypes([
    music.typeDefs,
    user.typeDefs,
]);

const resolvers = mergeResolvers([
    music.resolvers,
    user.resolvers,
]);


const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});


export default executableSchema;
