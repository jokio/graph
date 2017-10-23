import { pubsub } from '../../common/pubsub';
import { api, HttpCodes } from '../../common/api';

export default {
    User: {
        channels: async (obj, { offset, limit }, context) => {
            console.log('User.channels', obj)

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
    Query: {
        users: async (obj, { offset, limit }, context) => {

            return [
                { id: 1, name: 'ezeki' }
            ];
        }
    },
}
