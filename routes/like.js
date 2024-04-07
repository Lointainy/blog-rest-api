const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { like, getLikeMany } = require('../controllers/likeController');

const router = express.Router();

router.get('/', getLikeMany);
router.post('/:postId', [authMiddleware], like);

module.exports = router;

