import { List, Field, ObjectType, Ctx } from '@jokio/graphql-decorator';
import { User } from './types/user.type';
import { users } from '../data';


export default class UserQuery {
	@Field({ type: User, description: 'return all users.', isList: true })
	users(
		@Ctx() context: any,
	) {

		console.log(context);
		return users;
	}
}
