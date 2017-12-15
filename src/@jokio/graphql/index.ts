import { merge } from 'lodash';
import { mergeSchemas, introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { Engine } from 'apollo-engine';
import { graphiqlExpress } from 'apollo-server-express';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

import scalar from './modules/scalars';
import { RunProps } from './types';


export { Module } from './types';

export function devEnv() {
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').load();
    }
}

export async function run(props: RunProps) {

    const defaultProps = {
        port: '4000',
        endpoint: '/',
        modules: [],
        remtoeSchemaUrls: [],
        subscriptionEndpoint: 'ws://localhost:4000',
    };

    const {
        modules,
        port: portString,
        engineConfig,
        endpoint,
        disabledScalars,
        subscriptionsEndpoint,
        remtoeSchemaUrls,
    } = merge(defaultProps, props);

    const port = parseInt(portString, 10);


    let typeDefs = modules.map(x => x.typeDefs).join() || '';
    let resolvers = modules.map(x => x.resolvers).reduce(merge) || {};
    let remoteSchemas = [];

    for (let url of remtoeSchemaUrls) {
        remoteSchemas.push(await getRemoteSchema(url));
    }

    if (!disabledScalars) {
        typeDefs = scalar.typeDefs + typeDefs;
        resolvers = merge(resolvers, scalar.resolvers);
    }

    const schema = !remoteSchemas.length ? undefined : mergeSchemas({
        schemas: [...remoteSchemas, typeDefs],
        resolvers: resolvers
    })

    const pubsub = new PubSub();
    const context = {
        pubsub
    }

    const server = new GraphQLServer({
        schema,
        typeDefs,
        resolvers,
        context,
        options: {
            tracing: true,
            disablePlayground: true
        }
    });

    let engine;
    if (engineConfig && engineConfig.apiKey) {
        engine = new Engine({
            engineConfig,
            endpoint,
            graphqlPort: port,
        })
        engine.start();
    }

    server.express.get(endpoint, graphiqlExpress({ endpointURL: endpoint, subscriptionsEndpoint }))

    if (engineConfig && engineConfig.apiKey) {
        server.express.use(engine.expressMiddleware());
    }

    server.start(() => console.log(`Server is running on localhost:${port}`));

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