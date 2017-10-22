import { Query, Mutation, Schema, schemaFactory, Subscription } from '@jokio/graphql-decorator';
import UserQuery from './user.query';
import UserMutation from './user.mutation';
import UserSubscription from './user.subscription';

@Schema()
class RootSchema {
	@Query()
	UserQuery: UserQuery;

	@Mutation()
	UserMutation: UserMutation;

	@Subscription()
	UserSubscription: UserSubscription;
}


const schema = schemaFactory(RootSchema);

export default schema;
