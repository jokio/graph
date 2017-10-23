import { HttpCodes } from "typed-rest-client/HttpClient";
import { RestClient } from "typed-rest-client/RestClient";
import { pubsub } from '../../common/pubsub';


const api = new RestClient('Jok.Graph', 'http://x.jok.io');


export const resolvers = {
    Query: {
        users: async (obj, { offset, limit }, context) => {

            return [
                { id: 1, name: 'ezeki' }
            ];
        }
    },
}
