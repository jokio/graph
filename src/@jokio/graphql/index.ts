import { merge } from 'lodash';
import { mergeSchemas } from 'graphql-tools';
import { GraphQLServer } from 'graphql-yoga';
import { Engine } from 'apollo-engine';
import { graphiqlExpress } from 'apollo-server-express';

import { RunProps } from './types';


export { Module } from './types';

export async function run(props: RunProps) {

    const defaultProps = {
        port: '4000',
        endpoint: '/',
        modules: [],
        subscriptionEndpoint: 'ws://localhost:4000',
    };

    props = {
        ...defaultProps,
        ...props
    };

    const {
        modules,
        port: portString,
        engineConfig,
        endpoint,
        subscriptionEndpoint: subscriptionsEndpoint,
     } = props;

    const port = parseInt(portString, 10);

    const typeDefs = modules.map(x => x.typeDefs).join();
    const resolvers = modules.map(x => x.resolvers).reduce(merge);

    const schema = !props.modules.length ? undefined : mergeSchemas({
        schemas: [typeDefs],
        resolvers: resolvers
    })

    // const pubsub = new PubSub();
    const context = {
        // pubsub
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
    if (engineConfig) {
        engine = new Engine({
            engineConfig,
            endpoint,
            graphqlPort: port,
        })
        engine.start();
    }

    server.express.get(endpoint, graphiqlExpress({ endpointURL: endpoint, subscriptionsEndpoint }))

    if (engineConfig) {
        server.express.use(engine.expressMiddleware());
    }
    server.start(() => console.log(`Server is running on localhost:${port}`));

    return {
        server,
        engine
    }
}
