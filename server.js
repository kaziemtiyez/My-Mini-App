import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get("/api/status", (req, res) => res.json({ status: "ok" }));
app.get("/api/config", (req, res) => res.json({ config: {} }));

app.get("/api/admin-info", (req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.get("/api/bot-token", (req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Any route fallback without path-to-regexp
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
