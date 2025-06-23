require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const investRoutes = require('./routes/invest');
const referralRoutes = require('./routes/referral');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/invest', investRoutes);
app.use('/api/referral', referralRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));