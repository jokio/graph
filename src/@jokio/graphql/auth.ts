import { ConnectionContext } from "subscriptions-transport-ws";

export function getHttpToken(request: any, tokenName) {
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

			const subItems = x.split('=');
			if (!subItems || subItems.length !== 2)
				return null;

			return {
				key: subItems[0].trim(),
				value: subItems[1].trim(),
			};
		})
		.filter(x => !!x)
		.reduce((r, x) => {
			r[x.key] = x.value;
			return r;
		}, {});

	return cookieMap[tokenName];
}

export function getWsToken(connectionParams: any, tokenName) {
	return connectionParams[tokenName];
}

// export async function createContext(token, enableAuthentication) {

// 	const userId = enableAuthentication ? await validateAndGetUser(token) : null;

// 	return { userId, token };
// }


// async function validateAndGetUser(token) {
// 	try {
// 		if (!token)
// 			return null;

// 		const result = await api.get<any>(`/user/me`, { token: token });
// 		return result.id;
// 	}
// 	catch (err) {
// 		return null;
// 	}
// }
