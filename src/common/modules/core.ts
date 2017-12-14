export const typeDefs = `
type Query {
    info: ServerInfo
}

type ServerInfo {
    startTime: DateTime
}

type Mutation {
    checkStatus: Boolean
}

type Subscription {
    realtimeTest: String
}
`

const startTime = new Date();

export const resolvers = {
    Query: {
        info: () => ({
            startTime
        })
    },

    Mutation: {
        checkStatus: () => true
    },

    Subscription: {
        realtimeTest: {
            subscribe: () => null
        }
    }
}

export default {
    typeDefs,
    resolvers
}
