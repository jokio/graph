import { pubsub } from '../../common/pubsub';
import { api } from '../../common/api';

export default {
    Profile: {
        joker: async (obj, props, { token }) => {
            console.log(obj, props)

            return ({ lastPlayDate: Date.now() })
        }
    },
}
