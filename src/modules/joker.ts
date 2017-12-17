import { Resolvers } from "@jokio/graphql";

import { Context } from "../context";


export const typeDefs = `
extend type Profile {
	joker: JokerProfile
}

type JokerProfile {
	lastPlayDate: Float
}
`

export const resolvers: Resolvers<Context> = {
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
