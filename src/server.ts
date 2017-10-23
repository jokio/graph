import startGraphQLServer from './common/server.hapi';
import schema from './schema';

startGraphQLServer(
	schema,
	process.env.NODE_ENV === 'production' ? 'jok-test1.azurewebsites.net' : 'localhost',
	process.env.PORT || 3000,
);
