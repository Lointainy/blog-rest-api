const z = require('zod');
const { passwordSchema, emailSchema } = require('./auth');

const userSchema = z.object({
	name: z.string().optional(),
	isTwoFactorEnabled: z.boolean().optional()
});

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
	userSchema,
	newPasswordSchema,
	newEmailSchema,
	resetPasswordConfirmSchema
};

