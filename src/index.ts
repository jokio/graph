import GraphqlServer from './@jokio/graphql';
import Redis from './redis';

import core from './modules/core';
import joker from './modules/joker';
import music from './modules/music';
import social from './modules/social';
import user from './modules/user';


const modules = [
	core,
	user,
	joker,
	music,
	social,
];

const remtoeSchemaUrls = [
];


const redisConfig = process.env.REDIS_CONFIG;

const config = {
	modules,
	remtoeSchemaUrls,
	port: process.env.PORT,
	subscriptionsEndpoint: process.env.SUBSCRIPTION_URL,
	engineConfig: {
		apiKey: process.env.APOLLO_ENGINE_KEY,
	},
};


GraphqlServer.run(config)
	.then(({ pubsub }) => ({ pubsub, redisConfig }))
	.then(Redis.configure)
