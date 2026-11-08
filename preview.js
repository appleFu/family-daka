const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8787;
const memoryStore = {};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // 1. Mock API 同步接口
  if (url.pathname === '/api/sync') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const channel = url.searchParams.get('channel') || 'fute_family';

    if (req.method === 'GET') {
      const data = memoryStore[channel] || null;
      res.writeHead(200);
      return res.end(JSON.stringify({ code: 0, data }));
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          memoryStore[channel] = parsed;
          res.writeHead(200);
          res.end(JSON.stringify({ code: 0, message: 'saved' }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ code: 400, error: 'Invalid JSON' }));
        }
      });
      return;
    }
  }

  // 2. 静态文件服务
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error: ' + err.code);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🎉 本地预览服务器已启动！`);
  console.log(`👉 浏览器请访问: http://localhost:${PORT}`);
  console.log(`按 Ctrl+C 可停止运行。\n`);
  
  // 自动在 Mac 上呼起默认浏览器
  exec(`open http://localhost:${PORT}`);
});
