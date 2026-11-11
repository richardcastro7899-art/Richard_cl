// Servidor local mínimo para previsualizar el sitio: node serve.mjs [puerto]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(fileURLToPath(import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mp4": "video/mp4", ".webm": "video/webm", ".webp": "image/webp", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("no"); }
  const stat = fs.statSync(f), type = types[path.extname(f)] || "application/octet-stream";
  const range = req.headers.range;
  if (range) { const [a, b] = range.replace("bytes=", "").split("-"); const s = +a, e = b ? +b : stat.size - 1; res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${s}-${e}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": e - s + 1 }); return fs.createReadStream(f, { start: s, end: e }).pipe(res); }
  res.writeHead(200, { "Content-Type": type, "Content-Length": stat.size, "Accept-Ranges": "bytes" }); fs.createReadStream(f).pipe(res);
}).listen(+(process.argv[2] || 5173), () => console.log("http://localhost:" + (process.argv[2] || 5173)));
