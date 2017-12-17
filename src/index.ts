import GraphQL, { RunProps } from '@jokio/graphql';

import Redis from './redis';
import Music from './modules/music';
import Social from './modules/social';
import User from './modules/user';


const remoteSchemaUrls = [
	// 'https://graph.jok.ge/'
];

const modules = [
	User,
	Music,
	Social,
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
