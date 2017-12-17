import { Resolvers } from "../@jokio/graphql";
import { Context } from "../context";
import { Events } from '../redis';

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


export const resolvers: Resolvers<Context> = {
	User: {
		musicChannels: async (obj, props, { token, api }) =>
			await api.get(`/music/channel/list`, { ...props, onlyFavorites: true, token }),
	},
	Query: {
		musicChannels: async (obj, props, { token, api }) =>
			await api.get(`/music/channel/list`, { ...props, token }),
	},
	Mutation: {
		musicChannelSetFavorite: async (obj, { id, isFavorite }, { token, api }) =>
			await api.post(`/music/channel/${id}/${isFavorite ? 'favorite' : 'unfavorite'}`, null, { token }),

		musicChannelSetSource: async (obj, { id, streamUrl }, { token, api }) =>
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
