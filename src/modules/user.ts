import { Events } from '../redis';
import { RestAPI, Resolvers } from '../@jokio/graphql';
import { Context } from '../context';

export const typeDefs = `
extend type Query {
	user(id: Int): User
	token: String
	userId: String
}

extend type Mutation {
	userLogin(username: String!, password: String!): String!
}

enum Gender {
	male
	female
}

enum Language {
	en
	ge
	ru
}

type Profile {
	id: ID
}

type User {
	id: Int!
	nick: String!
	gender: Gender!
	avatarUrl: String!
	isVIP: Boolean!
	language: Language!

	musicChannels(includeOfflines: Boolean): [MusicChannel]!

	profile: Profile
}
`

export const resolvers: Resolvers<Context> = {
	User: {
		profile: (obj) => obj,
	},
	Query: {
		user: async (obj, { id = 'me' }, { token, api }) =>
			await api.get(`/user/${id}`, { token }).then(userLanguageMap),

		token: (obj, props, { token }) => token,

		userId: (obj, props, { userId }) => userId,
	},
	Mutation: {
		userLogin: async (obj, props, { api }) =>
			await api.post(`/user/login`, props)
	},
}

export default {
	typeDefs,
	resolvers
}



function userLanguageMap(user) {
	if (!user)
		return null;

	switch (user.language) {
		case 'en-US':
			user.language = 'en';
			break;

		case 'ka-GE':
			user.language = 'ge';
			break;

		case 'ru-RU':
			user.language = 'ru';
			break;
	}

	return user;
}
