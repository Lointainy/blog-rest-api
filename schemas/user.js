const z = require('zod');
const { passwordSchema, emailSchema } = require('./auth');

const newPasswordSchema = z.object({
	password: passwordSchema,
	newPassword: passwordSchema
});

const newEmailSchema = z.object({
	email: emailSchema,
	newEmail: emailSchema
});

const resetPasswordConfirmSchema = z.object({
	token: z.string(),
	newPassword: passwordSchema
});

module.exports = {
	newPasswordSchema,
	newEmailSchema,
	resetPasswordConfirmSchema
};

