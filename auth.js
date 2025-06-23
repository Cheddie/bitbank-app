const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, refCode } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const referredByUser = refCode ? await User.findOne({ refCode }) : null;
  const user = new User({
    email,
    passwordHash: hash,
    refCode: Math.random().toString(36).substring(2,8),
    referredBy: referredByUser ? referredByUser._id : null
  });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, refCode: user.refCode });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('No user');
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).send('Wrong password');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;