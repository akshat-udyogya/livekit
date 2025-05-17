const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LiveKit Token Server is running');
});

app.post('/get-token', (req, res) => {
  const { userName, roomName } = req.body;

  if (!userName || !roomName) {
    return res.status(400).json({ error: 'Missing userName or roomName' });
  }

  const at = new AccessToken(process.env.APIdDYBuyLvZmyH, process.env.OmVXnnFEA5UdPb2xZf5RAYfSyl7rf2wniXuTPyXpB5bA, {
    identity: userName,
  });

  at.addGrant({ roomJoin: true, room: roomName });

  const token = at.toJwt();
  res.json({ token });
});

app.listen(port, () => {
  console.log(`LiveKit token server listening at http://localhost:${port}`);
});
