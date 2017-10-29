import { pubsub } from '../../common/pubsub';
import { api } from '../../common/api';

export default {
    Profile: {
        joker: async (obj, props, { token }) => {
            return ({ lastPlayDate: Date.now() })
        }
    },
}
