import { ObjectType, Field, Arg, InputObjectType, Mutation, EnumType, Value } from '@jokio/graphql-decorator';
import { withFilter } from 'graphql-subscriptions';
import { users } from '../../data';
import { pubsub } from '../../common/pubsub';
import { GraphQLObjectType } from 'graphql';
import { Channel } from './types/channel.type';


export class Subscription {

	@Field({ type: Channel })
	musicChannelTrackUpdated = {
		subscribe: (a, b, c, d) => {
			// console.log(a, b, c);
			return pubsub.asyncIterator('musicChannelTrackUpdated');
		},
	};

	// @Field({ type: User, description: 'Delete a user and return the removed user.' })
	// userDeleted = {
	// 	subscribe: withFilter(
	// 		() => pubsub.asyncIterator('userDeleted'),
	// 		(payload, variables) => {
	// 			// the `messageAdded` channel includes events for all channels, so we filter to only
	// 			// pass through events for the channel specified in the query
	// 			return true;
	// 		},
	// 	),
	// };
}
