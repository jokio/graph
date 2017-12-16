export const typeDefs = `
type Query {
    serverInfo: ServerInfo
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
        serverInfo: () => ({
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
