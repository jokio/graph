import { PubSub } from 'graphql-subscriptions';
import * as Redis from 'ioredis';

export const pubsub = new PubSub();

const REDIS_CONFIG = process.env.REDIS_CONFIG;

console.log('REDIS_CONFIG', REDIS_CONFIG)

if (REDIS_CONFIG) {
    const configParams = REDIS_CONFIG.split(':');

    console.log('configParams', configParams)

    const redis = new Redis({
        host: configParams[0],
        port: +configParams[1],
        password: configParams[2],
    });

    redis.subscribe('musicChannelTrackUpdated', x => {
        // fill data
        pubsub.publish('musicChannelTrackUpdated', x);
    });
}