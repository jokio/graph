import { PubSub } from 'graphql-subscriptions';
import * as Redis from 'ioredis';

export const pubsub = new PubSub();

const REDIS_CONFIG = process.env.REDIS_CONFIG;

if (REDIS_CONFIG) {
    const redis = new Redis({
        host: REDIS_CONFIG.split(':')[0],
        port: +REDIS_CONFIG.split(':')[1],
        password: REDIS_CONFIG.split(':')[2],
    });

    redis.subscribe('musicChannelTrackUpdated', x => {
        // fill data
        pubsub.publish('musicChannelTrackUpdated', x);
    });
}