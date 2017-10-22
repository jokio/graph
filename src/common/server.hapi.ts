import * as hapi from 'hapi';
import { graphqlHapi, graphiqlHapi, HapiPluginOptions, HapiGraphiQLPluginOptions } from 'apollo-server-hapi';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, printSchema } from 'graphql';
import { validateAndGetUser, getToken } from './auth';


export default function serverHapi(
	schema,
	domain = 'localhost',
	port = process.env.PORT || 3000,
	path = '/graphql',
) {
	const server = new hapi.Server({ debug: false });

	const HOST = domain;
	const PORT = port;
	const SUBSCRIPTIONS_PATH = '/subscriptions';

	const graphqlOptions: HapiPluginOptions = {
		path,
		graphqlOptions: async request => ({
			schema,
			context: await validateAndGetUser(getToken(request)),
		}),
		route: {
			cors: true,
		},
	};

	const graphiqlOptions: HapiGraphiQLPluginOptions = {
		path: '/',
		graphiqlOptions: request => ({
			endpointURL: path,
			subscriptionsEndpoint: `ws://${HOST}:${PORT}${SUBSCRIPTIONS_PATH}`,
			editorTheme: 'elegant',
			websocketConnectionParams: {
				authToken: '123',
			},
		}),
	};

	server.connection({
		host: HOST,
		port: PORT,
	});

	server.register({
		register: graphqlHapi,
		options: graphqlOptions,
	});

	server.register({
		register: graphiqlHapi,
		options: graphiqlOptions,
	});

	server.route({
		method: 'GET',
		path: '/schema',
		handler: (request, reply) =>
			reply.response(printSchema(schema)).type('text/plain'),
	});



	server.start((err) => {
		if (err) {
			throw err;
		}

		const sub: SubscriptionServer = new SubscriptionServer({
			execute,
			subscribe,
			schema,
			onConnect: (connectionParams, socketOptions) => {
				if (connectionParams.authToken) {
					return validateAndGetUser(connectionParams.authToken);
				}
			},
		}, { server: server.listener, path: SUBSCRIPTIONS_PATH });

		console.log(`Server running at: ${server.info.uri}`);
	});
}
