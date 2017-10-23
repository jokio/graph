import { pubsub } from '../../common/pubsub';
import { api, HttpCodes } from '../../common/api';

export default {
    Channel: {
        users: (obj, { offset, limit }, context) => {
            return [
                { id: 1 }
            ]
        }
    },
    Query: {
        musicChannels: async (obj, { offset, limit }, context, info) => {
            const skip = offset || 0;
            const take = limit || 10;

            const response = await api.get<any[]>('/music/channel/list');
            if (response.statusCode !== HttpCodes.OK) {
                throw new Error(`Data fetch error: ${response.statusCode}`);
            }

            const items = response.result;
            if (!items || items.length == null) {
                throw new Error(`Invalid data received`);
            }

            items.forEach(x => x.key = x.channelKey)

            return items.slice(skip || 0, skip + take);
        }
    },
    Mutation: {
        musicChannelFavorite: async (obj, { id }, context) => {
            const token = context.currentUser ? context.currentUser.token : null;
            await api.create(`/music/channel/${id}/favorite?token=${token}`, {});

            return true;
        }
    },
    Subscription: {
        musicChannelTrackUpdated: {
            subscribe: (obj, args, context, info) => {
                return pubsub.asyncIterator('musicChannelTrackUpdated');
            },
        }
    },
}
