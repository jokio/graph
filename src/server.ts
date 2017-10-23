import startGraphQLServer from './common/server.hapi';
import schema from './schema';

startGraphQLServer(
	schema,
	process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
	process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
	process.env.PORT || 3000,
);
