import { pubsub, Events } from '../common/pubsub';
import { api } from '../common/api';

export const typeDefs = `
extend type Query {
    user(id: Int): User
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

export const resolvers = {
    User: {
        profile: (obj) => obj,
    },
    Query: {
        user: async (obj, { id = 'me' }, { token }) =>
            await api.get<any>(`/user/${id}`, { token }).then(userLanguageMap)
    },
    Mutation: {
        userLogin: async (obj, props) =>
            await api.post<string>(`/user/login`, props)
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
