import { pubsub } from '../../common/pubsub';
import { api } from '../../common/api';

export default {
    Profile: {
        facebook: async (obj, { id = 'me' }, { token }) => ({ fullname: 'Holla Bolla' })
    },
}
