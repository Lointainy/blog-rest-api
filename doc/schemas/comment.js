const comment = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			description: 'The unique identifier of the comment.'
		},
		postId: {
			type: 'string',
			description: 'The ID of the post the comment belongs to.'
		},
		content: {
			type: 'string',
			description: 'The content of the comment.'
		},
		createdAt: {
			type: 'string',
			format: 'date-time',
			description: 'The date and time when the comment was created.'
		},
		authorId: {
			type: 'string',
			description: 'The unique identifier of the user who created the comment.'
		},
		authorName: {
			type: 'string',
			description: 'The name of the user who created the comment.'
		}
	},
	example: {
		postId: '6612b0e83985168903e28398',
		content: 'This is my first comment for post',
		createdAt: '2024-04-10T13:14:04.829Z',
		authorId: '66129edfbaf3d628515d7f87',
		authorName: 'Eugene Kozakov'
	}
};

module.exports = { comment };

