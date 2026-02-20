import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("tubeseo.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    slug TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    youtube_id TEXT UNIQUE,
    title TEXT,
    description TEXT,
    thumbnail TEXT,
    category_id INTEGER,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS video_tags (
    video_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (video_id, tag_id),
    FOREIGN KEY (video_id) REFERENCES videos(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT,
    excerpt TEXT,
    image TEXT,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id INTEGER,
    user_name TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id)
  );
`);

// Seed initial data if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insertCat = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
  insertCat.run("Technology", "technology");
  insertCat.run("Education", "education");
  insertCat.run("Entertainment", "entertainment");
  insertCat.run("Lifestyle", "lifestyle");

  const insertVideo = db.prepare("INSERT INTO videos (youtube_id, title, description, thumbnail, category_id, views, likes) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertVideo.run("dQw4w9WgXcQ", "Never Gonna Give You Up", "The classic Rick Astley hit.", "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", 3, 1000000, 50000);
  insertVideo.run("jNQXAC9IVRw", "Me at the zoo", "The first video on YouTube.", "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg", 4, 2000000, 100000);
  insertVideo.run("9bZkp7q19f0", "PSY - GANGNAM STYLE", "Global phenomenon.", "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg", 3, 4000000, 200000);
  insertVideo.run("M7lc1UVf-VE", "YouTube iframe API", "Developer documentation.", "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg", 1, 50000, 1000);
  
  const insertBlog = db.prepare("INSERT INTO blog_posts (title, slug, content, excerpt, image) VALUES (?, ?, ?, ?, ?)");
  insertBlog.run("How to Optimize Your YouTube SEO", "youtube-seo-optimization", "Full guide on SEO...", "Learn the best practices for video discoverability.", "https://picsum.photos/seed/seo/800/400");
  insertBlog.run("The Future of Video Content", "future-of-video", "Video is king...", "Trends to watch in 2026.", "https://picsum.photos/seed/video/800/400");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/videos", (req, res) => {
    const { category, search, sort } = req.query;
    let query = `
      SELECT v.*, c.name as category_name 
      FROM videos v 
      JOIN categories c ON v.category_id = c.id
    `;
    const params: any[] = [];

    if (category) {
      query += " WHERE c.slug = ?";
      params.push(category);
    }

    if (search) {
      query += category ? " AND" : " WHERE";
      query += " (v.title LIKE ? OR v.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === "popular") {
      query += " ORDER BY v.views DESC";
    } else if (sort === "newest") {
      query += " ORDER BY v.published_at DESC";
    } else {
      query += " ORDER BY v.id DESC";
    }

    const videos = db.prepare(query).all(...params);
    res.json(videos);
  });

  app.get("/api/videos/:id", (req, res) => {
    const video = db.prepare(`
      SELECT v.*, c.name as category_name 
      FROM videos v 
      JOIN categories c ON v.category_id = c.id 
      WHERE v.youtube_id = ?
    `).get(req.params.id);
    
    if (!video) return res.status(404).json({ error: "Video not found" });
    
    const comments = db.prepare("SELECT * FROM comments WHERE video_id = ? ORDER BY created_at DESC").all((video as any).id);
    res.json({ ...video, comments });
  });

  app.post("/api/videos/:id/comments", (req, res) => {
    const { user_name, content } = req.body;
    const video = db.prepare("SELECT id FROM videos WHERE youtube_id = ?").get(req.params.id) as { id: number };
    if (!video) return res.status(404).json({ error: "Video not found" });

    const result = db.prepare("INSERT INTO comments (video_id, user_name, content) VALUES (?, ?, ?)").run(video.id, user_name, content);
    res.json({ id: result.lastInsertRowid, user_name, content, created_at: new Date().toISOString() });
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/blog", (req, res) => {
    const posts = db.prepare("SELECT * FROM blog_posts ORDER BY published_at DESC").all();
    res.json(posts);
  });

  app.get("/api/blog/:slug", (req, res) => {
    const post = db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(req.params.slug);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: /sitemap.xml");
  });

  app.get("/sitemap.xml", (req, res) => {
    const videos = db.prepare("SELECT youtube_id FROM videos").all() as { youtube_id: string }[];
    const blogs = db.prepare("SELECT slug FROM blog_posts").all() as { slug: string }[];
    
    res.type("application/xml");
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/</loc><priority>1.0</priority></url>
  <url><loc>/blog</loc><priority>0.8</priority></url>`;
    
    videos.forEach(v => {
      xml += `\n  <url><loc>/video/${v.youtube_id}</loc><priority>0.7</priority></url>`;
    });
    
    blogs.forEach(b => {
      xml += `\n  <url><loc>/blog/${b.slug}</loc><priority>0.6</priority></url>`;
    });
    
    xml += "\n</urlset>";
    res.send(xml);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
