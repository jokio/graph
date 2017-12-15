import { Events } from '../redis';
import { api } from '../api';

export const typeDefs = `
extend type Query {
    musicChannels(includeOfflines: Boolean): [MusicChannel]
}

extend type Mutation {
    musicChannelSetFavorite(id: Int!, isFavorite: Boolean!): Boolean
    musicChannelSetSource(id: Int!, streamUrl: String!): Boolean
}

extend type Subscription {
    musicChannelTrackUpdated: MusicTrack
}

type MusicTrack {
    id: Int
    info: String
    duration: Int
    lyrics: String
    youtubeVideoId: String
    imageUrl: String
}
  
type MusicChannel {
    id: Int!
    name: String!
    key: String
    source: String
    logoUrl: String
    stars: Int
    isFeatured: Boolean
    isOffline: Boolean
    isFavorite: Boolean
    offlineDate: Int
    createDate: Int
    track: MusicTrack
    users: [User]
}
`;


export const resolvers = {
    User: {
        musicChannels: async (obj, props, { token }) =>
            await api.get(`/music/channel/list`, { ...props, onlyFavorites: true, token }),
    },
    Query: {
        musicChannels: async (obj, props, { token }) =>
            await api.get(`/music/channel/list`, { ...props, token }),
    },
    Mutation: {
        musicChannelSetFavorite: async (obj, { id, isFavorite }, { token }) =>
            await api.post(`/music/channel/${id}/${isFavorite ? 'favorite' : 'unfavorite'}`, null, { token }),

        musicChannelSetSource: async (obj, { id, streamUrl }, { token }) =>
            await api.patch(`/music/channel/${id}/source/${streamUrl}`, null, { token }),
    },
    Subscription: {
        musicChannelTrackUpdated: {
            subscribe: (obj, props, { pubsub }) => pubsub.asyncIterator(Events.MusicChannel.TrackUpdated),
        }
    },
}

export default {
    typeDefs,
    resolvers
}
