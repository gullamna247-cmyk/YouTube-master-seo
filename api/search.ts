export default async function handler(req: any, res: any) {
  const { q } = req.query;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "https://www.googleapis.com/youtube/v3";

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${q}&key=${YOUTUBE_API_KEY}&maxResults=20`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
}
