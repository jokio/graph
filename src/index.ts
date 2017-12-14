import * as graphqlServer from '@jokio/graphql';

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

const engineConfig = {
	apiKey: process.env.APOLLO_ENGINE_KEY || 'service:playerx-747:qh9bULYm5hNnMODRcw46Rw'
};

graphqlServer.run({
	port: process.env.PORT,
	subscriptionEndpoint: process.env.SUBSCRIPTION_URL,
	modules,
	engineConfig,
});