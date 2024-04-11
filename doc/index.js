const authSchema = require('./schemas/auth');
const userSchema = require('./schemas/user');
const postSchema = require('./schemas/post');
const likeSchema = require('./schemas/like');
const commentSchema = require('./schemas/comment');

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: 'Blog',
			description: '',
			contact: {
				name: 'Eugene Kozakov'
			}
		},
		servers: [
			{
				url: 'http://localhost:3500/api',
				description: 'Development Server'
			},
			{
				url: 'https://blog-rest-server.vercel.app/api',
				description: 'Production Server'
			}
		],
		schemes: ['http', 'https'],
		tags: [
			{
				name: 'Auth',
				description: 'Sign in / out operation'
			},
			{
				name: 'User',
				description: 'Operation about user'
			},
			{
				name: 'Post',
				description: 'Operation with post'
			}
		],
		components: {
			schemas: {
				login: authSchema.login,
				register: authSchema.register,
				user: userSchema.user,
				post: postSchema.post,
				comment: commentSchema.comment,
				like: likeSchema.like
			},
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					description: 'Enter token value',
					bearerFormat: 'JWT',
					example:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDMxYjJiYjAzYWVlZWY3NjcxOGE0ZDEiLCJpYXQiOjE2ODA5ODE0MzksImV4cCI6MTY4MTI0MDYzOX0.x79DREi5tv_YHHEJE2Vwxax3EZwjkZywS20MIeK0JWk'
				}
			}
		},
		security: [
			{
				bearerAuth: []
			}
		]
	},
	apis: ['./routes/*.js']
};

const optionDoc = {
	customCss: `
		.swagger-ui .topbar { display: none}
		.opblock-summary-path-description-wrapper {display: flex; flex-wrap: wrap;}
		.swagger-ui .opblock .opblock-summary-path { max-width: fit-content; }
		.swagger-ui .copy-to-clipboard {right: 0px; width: 32px;}
	`,
	customSiteTitle: 'Blog API',
	customSiteFavicon: '',
	customCssUrl: CSS_URL
};

module.exports = { swaggerOptions, optionDoc };

