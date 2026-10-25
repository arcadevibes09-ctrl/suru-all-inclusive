// FILE: backend/server.js
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3001;
const DB_FILE = path.resolve('./suru_store.json');
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const OLLAMA_MODEL = 'qwen2.5:0.5b'; // ~398MB-500MB ultra-fast local model

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ notes: [], gym: {}, tasks: {} }, null, 2));
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Sync State Endpoint
  if (req.url === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(fs.readFileSync(DB_FILE, 'utf-8'));
  }

  if (req.url === '/api/state' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      fs.writeFileSync(DB_FILE, body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // 500MB AI Proxy Endpoint (connects to local Ollama qwen2.5:0.5b)
  if (req.url === '/api/ai' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const { prompt, systemContext } = JSON.parse(body);
        const ollamaRes = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt: `${systemContext || ''}\n\nUser: ${prompt}\nAssistant:`,
            stream: false
          })
        });
        const data = await ollamaRes.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: data.response || 'Completed.' }));
      } catch (err) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Local Ollama offline, falling back to WebGPU' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Suru Backend + 500MB AI Router running on http://localhost:${PORT}`);
});
