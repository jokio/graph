import { Request } from 'hapi';

function validateToken(authToken) {
	// ... validate token and return a Promise, rejects in case of an error

	return new Promise((resolve, reject) => resolve());
}

function findUser(authToken) {
	return (tokenValidationResult) => {

		// ... finds user by auth token and return a Promise, rejects in case of an error
		return { id: 1, nick: 'Ezeki', token: authToken };
	};
}

export function getToken(request: Request, tokenName = 'token') {
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

export function validateAndGetUser(authToken) {
	return validateToken(authToken)
		.then(findUser(authToken))
		.then(user => ({ currentUser: user }));
}
