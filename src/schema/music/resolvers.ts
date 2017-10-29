import { pubsub, Events } from '../../common/pubsub';
import { api } from '../../common/api';


export default {
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
            subscribe: () => pubsub.asyncIterator(Events.MusicChannel.TrackUpdated),
        }
    },
}
