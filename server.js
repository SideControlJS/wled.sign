const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const twitch = require('./twitch-api');
const wledRoutes = require('./routes/wled');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// WLED routes
app.use('/wled', wledRoutes);

// Start Twitch Listener
twitch.startTwitchListener();

// Default Route
app.get('/', (req, res) => {
  res.send('LED Sign Node.js Server Running');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});