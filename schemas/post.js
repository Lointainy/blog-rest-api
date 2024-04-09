const z = require('zod');

const postSchema = z.object({
	title: z.string().min(5, { message: 'Title is required' }),
	content: z.string().min(30, { message: 'Content is required' }),
	views: z.number().int().positive().default(0).optional(),
	likes: z.number().int().positive().default(0).optional(),
	published: z.boolean().default(false).optional(),
	tags: z.array(z.string()).default([]).optional(),
	image: z.string().optional()
});

module.exports = { postSchema };

