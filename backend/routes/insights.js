const express = require('express');
const auth = require('../middleware/auth');
const { getInsights } = require('../controllers/insightController');

const router = express.Router();

router.use(auth);

router.get('/', getInsights);

module.exports = router;
