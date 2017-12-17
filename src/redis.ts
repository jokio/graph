import * as Redis from 'ioredis';


export const Events = {
	MusicChannel: {
		TrackUpdated: 'MusicChannel.TrackUpdated'
	}
}


export function configure({ redisConfig, pubsub }) {
	if (!redisConfig) return;

	const configParams = redisConfig.split(':');

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

export default {
	configure,
	Events,
}
