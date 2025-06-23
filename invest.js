const express = require('express');
const Investment = require('../models/Investment');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

function requireAuth(req, res, next) {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).send('Unauthorized');
  const token = auth.split(' ')[1];
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).send('Invalid token'); }
}

router.post('/create', requireAuth, async (req, res) => {
  const { amount, days } = req.body;
  if (!amount || !days || days < 15) return res.status(400).send('Invalid plan');
  const inv = new Investment({ userId: req.user.id, amount, days, startDate: new Date() });
  await inv.save();
  res.json(inv);
});

router.get('/balance', requireAuth, async (req, res) => {
  const inv = await Investment.findOne({ userId: req.user.id, status: 'active' });
  if (!inv) return res.json({ balance: 0, daysLeft: 0 });
  const elapsed = (Date.now() - inv.startDate) / (1000 * 60 * 60 * 24);
  let daysLeft = inv.days - elapsed;
  if (daysLeft < 0) daysLeft = 0;
  const balance = inv.amount * Math.pow(1 + inv.dailyRate, Math.min(elapsed, inv.days));
  if (elapsed >= inv.days) { inv.status = 'complete'; await inv.save(); }
  res.json({ balance, daysLeft });
});

router.post('/withdraw', requireAuth, async (req, res) => {
  const inv = await Investment.findOne({ userId: req.user.id, status: 'complete' });
  if (!inv) return res.status(400).send('No mature investment');
  const payout = inv.amount * Math.pow(1 + inv.dailyRate, inv.days);
  const user = await User.findById(req.user.id);
  user.wallet.balance += payout;
  await user.save();
  await inv.remove();
  res.json({ paid: payout });
});

module.exports = router;