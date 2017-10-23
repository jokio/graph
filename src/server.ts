import startGraphQLServer from './common/server.hapi';
import schema from './schema';

startGraphQLServer(
	schema,
	process.env.NODE_ENV === 'production' ? 'test-ssl-app.herokuapp.com' : 'localhost',
	process.env.PORT || 3000,
);
