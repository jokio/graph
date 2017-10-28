import startGraphQLServer from './common/server.hapi';
import schema from './schema';

/* Production: env variables required
 - NODE_ENV : production
 - DOMAIN : graph.jok.io
 - PORT : random
 - REDIS_CONFIG : RedisUrl:Port:Password
*/

const isProduction = process.env.NODE_ENV === 'production';

const host = isProduction ? '0.0.0.0' : 'localhost';
const port = process.env.PORT || 3000;

const subscriptionUrl = isProduction
	? `wss://${process.env.DOMAIN}/subscription`
	: `ws://${host}:${port}/subscription`

startGraphQLServer(
	schema,
	host,
	port,
	subscriptionUrl,
	'/graphql',
	isProduction,
);
