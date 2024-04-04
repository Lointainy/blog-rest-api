const z = require('zod');

const commentSchema = z.object({
	content: z.string().min(15, { message: 'Content is required' })
});

module.exports = { commentSchema };

