export const typeDefs = `
extend type Profile {
	joker: JokerProfile
}

type JokerProfile {
	lastPlayDate: Float
}
`

export const resolvers = {
	Profile: {
		joker: async (obj, props, { token }) => {
			return ({ lastPlayDate: Date.now() })
		}
	},
}

export default {
	typeDefs,
	resolvers
}
