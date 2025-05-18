require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LiveKit Token Server is running');
});

app.post('/get-token', (req, res) => {
  const { userName, roomName } = req.body;

  console.log('Received /get-token request');
  console.log('userName:', userName);
  console.log('roomName:', roomName);
  console.log('API KEY:', process.env.LIVEKIT_API_KEY);
  console.log('API SECRET:', process.env.LIVEKIT_API_SECRET);

  if (!userName || !roomName) {
    console.error('Missing userName or roomName');
    return res.status(400).json({ error: 'Missing userName or roomName' });
  }

  try {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: userName }
    );

    at.addGrant({
      roomJoin: true,
      room: roomName
    });

    const token = at.toJwt();

    console.log('Generated token:', token);

    res.json({ token });
  } catch (err) {
    console.error('Error generating token:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(port, () => {
  console.log(`✅ LiveKit token server listening at http://localhost:${port}`);
});
