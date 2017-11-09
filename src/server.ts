import startGraphQLServer from './common/server.hapi';
import schema from './schema';

/* Production: env variables required
 - NODE_ENV : production
 - DOMAIN : graph.jok.io
 - PORT : random
 - REDIS_CONFIG : RedisUrl:Port:Password
 - APOLLO_GATEWAY_KEY: ''
*/

const isProduction = process.env.NODE_ENV === 'production';
const enableAuthentication = true;

const host = isProduction ? '0.0.0.0' : 'localhost';
const port = process.env.PORT || 3000;

process.env.PORT = port;

const subscriptionUrl = isProduction
	? `wss://${process.env.DOMAIN}/subscription`
	: `ws://${host}:${port}/subscription`

const gatewayKey = process.env.APOLLO_GATEWAY_KEY || 'service:jokio-Jok-Graph:SbERVBMqTF7waWVKPb31VA';


startGraphQLServer(
	schema,
	host,
	port,
	subscriptionUrl,
	'/graphql',
	isProduction,
	enableAuthentication,
	isProduction ? gatewayKey : '',
);
