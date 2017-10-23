import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

// export const pubsub = new PubSub();

const REDIS_DOMAIN_NAME = 'redis-18107.c2.eu-west-1-3.ec2.cloud.redislabs.com';
const REDIS_PORT_NUMBER = 18107;
const REDIS_PASSWORD = 'E5kizdrOHDFt7eb8';


export const pubsub = new RedisPubSub({
    connection: {
        host: REDIS_DOMAIN_NAME,
        port: REDIS_PORT_NUMBER,
        password: REDIS_PASSWORD,
        retry_strategy: x => Math.max(x.attempt * 100, 3000)
    }
});

let i = 1;
setInterval(x => {

    const channel = {
        id: i++,
        name: 'test',
        key: 'xxx2'
    }

    pubsub.publish('musicChannelTrackUpdated', {
        musicChannelTrackUpdated: channel,
    });
}, 1000);


// const subscriptionManager = new PubSubEngine({
//     schema,
//     pubsub,
//     setupFunctions: {},
// });