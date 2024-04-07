const login = {
	type: 'object',
	properties: {
		email: {
			type: 'string',
			example: 'admin@mail.com'
		},
		password: {
			type: 'string',
			example: '@Dm1n'
		},
		code: {
			type: 'string',
			example: '123456'
		}
	}
};

const register = {
	type: 'object',
	properties: {
		email: {
			type: 'string',
			example: 'john@mail.com'
		},
		password: {
			type: 'string',
			example: 'P@ssw0rd'
		},
		name: {
			type: 'string',
			example: 'John'
		}
	}
};

module.exports = { login, register };

