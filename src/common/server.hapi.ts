import * as hapi from 'hapi';
import { graphqlHapi, graphiqlHapi, HapiPluginOptions, HapiGraphiQLPluginOptions } from 'apollo-server-hapi';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe, printSchema } from 'graphql';
import { createContext, getToken } from './auth';

export default function serverHapi(
	schema,
	host = 'localhost',
	port = 3000,
	subscriptionHost = '',
	graphqlPath = '/graphql',
	redirectToHttps = false,
	enableAuthentication = false
) {
	const server = new hapi.Server({ debug: false });

	const HOST = host;
	const PORT = port;
	const SUBSCRIPTIONS_PATH = '/subscription';


	if (redirectToHttps) {
		var http = new hapi.Server({ debug: false });

		http.connection({
			host: HOST,
			port: 80,
		});

		http.route({
			method: '*',
			path: '/{path*}',
			handler: () => this.reply.redirect('https://${HOST}/') //  + this.params.path
		});

		http.start();
	}

	const graphqlOptions: HapiPluginOptions = {
		path: graphqlPath,
		graphqlOptions: async request => ({
			schema,
			context: await createContext(getToken(request), enableAuthentication),
		}),
		route: {
			cors: true,
		},
	};

	const graphiqlOptions: HapiGraphiQLPluginOptions = {
		path: '/',
		graphiqlOptions: request => ({
			endpointURL: graphqlPath,
			subscriptionsEndpoint: subscriptionHost,
			editorTheme: 'elegant',
			websocketConnectionParams: {
				token: request.query.token,
			},
		}),
	};

	server.connection({
		host: HOST,
		port: +PORT,
	});

	server.register({ register: graphqlHapi, options: graphqlOptions });
	server.register({ register: graphiqlHapi, options: graphiqlOptions });

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
				if (connectionParams.token) {
					return createContext(connectionParams.token, enableAuthentication);
				}
			},
		}, { server: server.listener, path: SUBSCRIPTIONS_PATH });

		console.log(`Server running at: ${server.info.uri}`);
	});
}
