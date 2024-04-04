const authValidation = require('./auth');
const userValidation = require('./user');
const postValidation = require('./post');
const commentValidation = require('./comment');

module.exports = {
	authValidation,
	userValidation,
	postValidation,
	commentValidation
};

