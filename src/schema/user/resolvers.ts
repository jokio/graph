import { pubsub } from '../../common/pubsub';
import { api } from '../../common/api';
import { userLanguageMap } from './mappers';

export default {
    User: {
        avatar: async (obj, { id = 'me' }, { token }) =>
            await api.get<any>(`/user/${id}/avatar`, { token }),

        profile: (obj) => obj,
    },
    Query: {
        user: async (obj, { id = 'me' }, { token }) =>
            await api.get<any>(`/user/${id}`, { token }).then(userLanguageMap)
    },
}
