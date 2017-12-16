export const typeDefs = `
type Query {
    serverInfo: ServerInfo
}

type ServerInfo {
    startTime: DateTime
    upTime: ServerUpTime
}

type ServerUpTime {
    inSec: Float
    inMin: Float
    inHour: Float
    inDay: Float
}

type Mutation {
    checkStatus: Boolean
}

type Subscription {
    realtimeTest: String
}
`

const startTime = Date.now();

export const resolvers = {
    Query: {
        serverInfo: () => ({
            startTime: new Date(startTime),
            upTime: {
                inSec: (Date.now() - startTime) / (1000),
                inMin: (Date.now() - startTime) / (1000 * 60),
                inHour: (Date.now() - startTime) / (1000 * 60 * 60),
                inDay: (Date.now() - startTime) / (1000 * 60 * 60 * 24),
            }
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
