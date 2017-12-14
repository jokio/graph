export const typeDefs = `
extend type Profile {
    facebook: FacebookProfile
}

type FacebookProfile {
    fullname: String
}
`

export const resolvers = {
    Profile: {
        facebook: async (obj, { id = 'me' }, { token }) => ({ fullname: 'Holla Bolla' })
    },
}

export default {
    typeDefs,
    resolvers
}
