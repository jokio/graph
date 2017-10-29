import { Request } from 'hapi';
import { api } from './api';

export function getToken(request: Request, tokenName = 'token') {
	if (request.query && request.query.token)
		return request.query.token;

	const cookie = request.headers.cookie;
	if (!cookie)
		return null;

	const cookieMap = cookie
		.split(';')
		.map(x => {
			if (!x)
				return null;

			const subItems = x.split(':');
			if (!subItems || subItems.length !== 2)
				return null;

			return {
				key: subItems[0],
				value: subItems[1],
			};
		})
		.filter(x => !!x)
		.reduce((r, x) => {
			r[x.key] = x.value;
			return r;
		}, {});

	return cookieMap[tokenName];
}

export async function createContext(token, enableAuthentication) {

	const userId = enableAuthentication ? await validateAndGetUser(token) : null;

	return { userId, token };
}


async function validateAndGetUser(token) {
	try {
		if (!token)
			return null;

		const result = await api.get<any>(`/user/me`, { token: token });
		return result.id;
	}
	catch (err) {
		return null;
	}
}
