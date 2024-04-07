const post = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			description: 'The unique identifier of the post.'
		},
		title: {
			type: 'string',
			description: 'The title of the post.'
		},
		content: {
			type: 'string',
			description: 'The content of the post.'
		},
		createdAt: {
			type: 'string',
			format: 'date-time',
			description: 'The date and time when the post was created.'
		},
		updatedAt: {
			type: 'string',
			format: 'date-time',
			description: 'The date and time when the post was last updated.'
		},
		views: {
			type: 'integer',
			description: 'The number of views for the post.'
		},
		published: {
			type: 'boolean',
			description: 'Indicates if the post is published or not.'
		},
		tags: {
			type: 'array',
			items: {
				type: 'string'
			},
			description: 'List of tags associated with the post.'
		},
		image: {
			type: 'string',
			nullable: true,
			description: 'URL of the image associated with the post.'
		},
		authorId: {
			type: 'string',
			description: 'The unique identifier of the post author.'
		},
		authorName: {
			type: 'string',
			description: 'The name of the post author.'
		},
		likesCount: {
			type: 'integer',
			description: 'The number of likes for the post.'
		},
		commentsCount: {
			type: 'integer',
			description: 'The number of comments for the post.'
		}
	},
	example: {
		title: 'Fire Tower',
		content: 'This post is created by the administrator for a test request to the server',
		views: 0,
		published: false,
		tags: [],
		image: null,
		likesCount: 0,
		commentsCount: 0
	}
};

module.exports = { post };

