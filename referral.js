const express = require('express');
const router = express.Router();
router.post('/claim', (req, res) => res.send('Referral processed at signup'));
module.exports = router;