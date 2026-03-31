const express = require('express');
const auth = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { getInsights } = require('../controllers/insightController');

const router = express.Router();

router.use(apiLimiter);
router.use(auth);

router.get('/', getInsights);

module.exports = router;
