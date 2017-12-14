import GraphQLJSON from './json';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from './datetime';

export const typeDefs = `
scalar JSON
scalar Date
scalar Time
scalar DateTime
`;

export const resolvers = {
    JSON: GraphQLJSON,
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
};

export default {
    typeDefs,
    resolvers
}