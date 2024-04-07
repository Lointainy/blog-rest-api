const user = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			example: '660abd18f4c5e16ca6bf17c8',
			description: 'Unique identifier for the user.'
		},
		name: {
			type: 'string',
			example: 'John Doe',
			description: "User's name."
		},
		email: {
			type: 'string',
			example: 'example@mail.com',
			description: "User's email address."
		},
		emailVerified: {
			type: 'string',
			format: 'date-time',
			example: '2024-04-01T14:21:48.412Z',
			description: 'Date and time when the email was verified.'
		},
		image: {
			type: 'string',
			example: 'https://example.com/avatar.jpg',
			description: "URL to user's profile image."
		},
		role: {
			type: 'string',
			example: 'USER',
			description: "User's role in the system."
		},
		isTwoFactorEnabled: {
			type: 'boolean',
			example: false,
			description: 'Indicates whether two-factor authentication is enabled for the user.'
		}
	}
};

module.exports = { user };

