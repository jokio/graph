import { PubSub } from 'graphql-subscriptions';
import * as Redis from 'ioredis';

export const pubsub = new PubSub();

const REDIS_CONFIG = process.env.REDIS_CONFIG;

export const Events = {
    MusicChannel: {
        TrackUpdated: 'MusicChannel.TrackUpdated'
    }
}


if (REDIS_CONFIG) {
    const configParams = REDIS_CONFIG.split(':');

    const redis = new Redis({
        host: configParams[0],
        port: +configParams[1],
        password: configParams[2],
    });

    redis.on('message', (channel, msg) => {

        switch (channel) {
            case Events.MusicChannel.TrackUpdated:
                const payload = JSON.parse(msg);

                // TODO: save track and populate more info

                pubsub.publish(channel, payload);
                break;
        }

    });

    redis.subscribe(Events.MusicChannel.TrackUpdated);
}