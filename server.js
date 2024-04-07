const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const dotenv = require('dotenv');

const connectDB = require('./config/connectDB');
const { swaggerOptions, optionDoc } = require('./doc');

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3500;

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, optionDoc));

/* Cors */

app.use(
	cors({
		methods: '*'
		// origin: ['http://localhost:5173', 'http://192.168.0.100:5173']
	})
);

/* Middleware */

app.use((req, res, next) => {
	res.header('Content-Type', 'application/json');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Routes */

app.get('/', (req, res) => {
	res.redirect('/docs');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/post', require('./routes/posts'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/like'));

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

startServer();

