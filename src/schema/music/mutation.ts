import { ObjectType, Field, Arg, InputObjectType, EnumType, Value, Ctx } from '@jokio/graphql-decorator';
import { users } from '../../data';
import { pubsub } from '../../common/pubsub';
import * as gql from 'graphql';
import { RestClient } from 'typed-rest-client/RestClient';

const api = new RestClient('Jok.Graph', 'http://x.jok.io');

export class Mutation {

	@Field({ type: gql.GraphQLBoolean, description: 'Create a user and return the created user.' })
	async musicChannelFavorite(
		@Arg({ name: 'id', nonNull: true }) id: number,
		@Ctx() context,
	) {
		const token = context.currentUser ? context.currentUser.token : null;
		await api.create(`/music/channel/${id}/favorite?token=${token}`, {});

		return true;
	}

	// @Field({ type: User, description: 'Delete a user and return the removed user.' })
	// deleteUser(
	// 	@Arg({ name: 'id', nonNull: true }) id: string,
	// ) {
	// 	const user = users.find(u => u.id === id) as User;
	// 	if (!user) return null;

	// 	const index = users.indexOf(user);
	// 	if (index === -1)
	// 		return null;

	// 	pubsub.publish('userDeleted', {
	// 		userDeleted: user,
	// 	});

	// 	users.splice(index, 1);
	// 	return user;
	// }



	// @Field({ type: User, description: 'Delete a user and return the removed user.' })
	// enumTest(
	// 	@Arg({ name: 'type2', type: UserRoleType }) type: UserRoleType,
	// ) {
	// 	return {
	// 		name: type,
	// 	};
	// }
}


