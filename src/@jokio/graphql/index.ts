import { merge } from 'lodash';
import { mergeSchemas, introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { Engine } from 'apollo-engine';
import { graphiqlExpress } from 'apollo-server-express';
import { HttpLink } from './link-http';
import fetch from 'node-fetch';

import coreModule, { SYSTEM_INFO_EVENT } from './modules/core';
import scalarModule from './modules/scalars';
import { RunProps } from './types';
import { RestAPI } from './api';
import { Request } from 'express';
import * as auth from './auth';
import { execute, subscribe } from 'graphql';

export { Module, Resolvers, Context, RunProps } from './types';
export { RestAPI } from './api'

export function devEnv() {
	if (process.env.NODE_ENV !== 'production') {
		require('dotenv').load();
	}
}

export async function run(props: RunProps) {

	// read config
	const defaultProps: RunProps = {
		port: '4000',
		endpoint: '/',
		tokenName: 'token',
		modules: [],
		remtoeSchemaUrls: [],
		subscriptionEndpoint: 'ws://localhost:4000',
		getHttpToken: auth.getHttpToken,
		getWsToken: auth.getWsToken,

		yogaOptions: {
			tracing: { mode: 'http-header' },
			disablePlayground: true,
		}
	};

	const {
        modules,
		port: portString,
		engineConfig,
		endpoint,
		apiUrls,
		tokenName,
		disabledScalars,
		subscriptionEndpoint,
		remtoeSchemaUrls,
		disableCoreModule,
		yogaOptions,
		enableAuthentication,
		getUserId,
		getHttpToken,
		getWsToken,
		websocketConnectionParams,
    } = merge(defaultProps, props);

	const port = parseInt(portString, 10);


	// validation
	if (enableAuthentication && !getUserId) {
		throw new Error('Please set getUserId in RunProps');
	}


	// logic
	if (!disableCoreModule) {
		modules.unshift(coreModule);
	}

	if (!disabledScalars) {
		modules.unshift(scalarModule);
	}

	let typeDefs = modules.map(x => x.typeDefs).join() || '';
	let resolvers = modules.map(x => x.resolvers).reduce(merge) || {};
	let remoteSchemas = [];

	for (let url of remtoeSchemaUrls) {
		remoteSchemas.push(await getRemoteSchema(url));
	}

	const schema = !remoteSchemas.length ? undefined : mergeSchemas({
		schemas: [...remoteSchemas, typeDefs],
		resolvers: resolvers
	});

	const apis = {};
	for (let key in apiUrls) {
		apis[key] = new RestAPI(apiUrls[key]);
	}

	const pubsub = new PubSub();
	const context = ({ request, connectionParams }) => {
		let token = null;
		let userId = null;

		if (request)
			token = getHttpToken(request, tokenName);

		if (connectionParams)
			token = getWsToken(connectionParams, tokenName);

		// if (enableAuthentication && token)
		// 	userId = await getUserId(token, apis);

		return {
			token,
			userId,
			pubsub,
			...apis,
		}
	};

	const server = new GraphQLServer({
		schema,
		typeDefs,
		resolvers,
		context,
		options: yogaOptions
	})

	let engine;
	if (engineConfig && engineConfig.apiKey) {
		engine = new Engine({
			engineConfig,
			endpoint,
			graphqlPort: port,
		})
		engine.start();
	}

	if (yogaOptions && yogaOptions.disablePlayground)
		server.express.get(endpoint, graphiqlExpress({
			endpointURL: endpoint,
			subscriptionsEndpoint: subscriptionEndpoint,
			websocketConnectionParams
		}))

	if (engineConfig && engineConfig.apiKey) {
		server.express.use(engine.expressMiddleware());
	}

	await server.start(() => console.log(`Server is running on localhost:${port}`));

	const subscriptionServer: any = server.subscriptionServer;

	subscriptionServer.onOperation = null;
	subscriptionServer.onConnect = async (connectionParams) =>
		await context({ connectionParams, request: null });


	return {
		server,
		engine,
		pubsub,
	}
}

export async function getRemoteSchema(uri) {
	const link = new HttpLink({ uri, fetch })
	const introspectionSchema = await introspectSchema(link);
	const graphcoolSchema = makeRemoteExecutableSchema({
		schema: introspectionSchema,
		link
	});

	return graphcoolSchema;
}


devEnv();

export default {
	run,
	devEnv,
	getRemoteSchema,
}
