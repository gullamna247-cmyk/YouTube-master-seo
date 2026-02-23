import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Search route
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const url = `${BASE_URL}/search?part=snippet&q=${q}&key=${YOUTUBE_API_KEY}&maxResults=20`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Trending videos
app.get('/api/trending', async (req, res) => {
  try {
    const url = `${BASE_URL}/videos?part=snippet&chart=mostPopular&key=${YOUTUBE_API_KEY}&maxResults=20`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Trending fetch failed' });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
