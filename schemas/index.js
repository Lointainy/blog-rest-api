const z = require('zod');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

const emailSchema = z.string().email({ message: 'Emails is required' });
const passwordSchema = z
	.string()
	.min(5, { message: 'Minimum of 5 characters required' })
	.max(16, { message: 'Maximum of 16 characters required' })
	.regex(passwordRegex, {
		message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
	});

const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	code: z.optional(
		z
			.string()
			.min(6, {
				message: 'Code must been 6 characters required'
			})
			.max(6, {
				message: 'Code must been 6 characters required'
			})
	)
});

const registerSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	name: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	})
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
	loginSchema,
	registerSchema,
	passwordSchema,
	emailSchema,
	newPasswordSchema,
	newEmailSchema,
	resetPasswordConfirmSchema
};

