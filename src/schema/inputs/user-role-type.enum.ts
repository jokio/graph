import { EnumType, Value } from '@jokio/graphql-decorator';


@EnumType({ description: 'An user role. Either ADMIN or DEFAULT' })
export class UserRoleType {

	@Value(0, { description: 'Admin role' })
	ADMIN: string;

	@Value('value', { description: 'Default role' })
	DEFAULT: string;

	@Value(null, { description: 'God role' })
	GOD: string;

}
