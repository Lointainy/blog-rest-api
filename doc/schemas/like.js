const like = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			description: 'The unique identifier of the like.'
		},
		postId: {
			type: 'string',
			description: 'The ID of the post that was liked.'
		},
		authorId: {
			type: 'string',
			description: 'The unique identifier of the user who liked the post.'
		},
		authorName: {
			type: 'string',
			description: 'The name of the user who liked the post.'
		},
		authorImg: {
			type: ['string', 'null'],
			description: 'The URL of the profile image of the user who liked the post. Can be null.'
		},
		createdAt: {
			type: 'string',
			format: 'date-time',
			description: 'The date and time when the like was created.'
		}
	},
	example: {
		postId: '6612b0e83985168903e28398',
		authorId: '66129edfbaf3d628515d7f87',
		authorName: 'Eugene',
		authorImg: null,
		createdAt: '2024-04-07T14:43:10.820Z'
	}
};

module.exports = { like };

