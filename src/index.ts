import GraphQL, { RunProps } from '@jokio/graphql';
import Redis from './redis';

import joker from './modules/joker';
import music from './modules/music';
import social from './modules/social';
import user from './modules/user';


const remoteSchemaUrls = [
	// 'https://graph.jok.io/'
];

const modules = [
	user,
	joker,
	music,
	social,
];

const apiUrls = {
	api: 'https://x.jok.io'
}

const {
	PORT: port,
	REDIS_CONFIG: redisConfig,
	SUBSCRIPTION_URL: subscriptionEndpoint,
	APOLLO_ENGINE_KEY: apiKey
} = process.env;


const config: RunProps = {
	modules,
	remoteSchemaUrls,
	apiUrls,
	port,
	subscriptionEndpoint,
	engineConfig: { apiKey },
	enableAuthentication: false,
	getUserId: (token, { api }) => api.get<any>(`/user/me`, { token: token }).then(x => x.id),
};


GraphQL.run(config)
	.then(({ pubsub }) => ({ pubsub, redisConfig }))
	.then(Redis.configure)
