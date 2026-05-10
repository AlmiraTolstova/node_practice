import http from "http";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import emitter from "./logger.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VALID_API_KEY = process.env.VALID_API_KEY || "api_key";
const port = process.env.PORT || 3333;
function checkApiKey(headers) {
  const apiKey = headers["x-api-key"];
  return apiKey === VALID_API_KEY;
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: message }));
}

// fetch("http://127.0.0.1:3333/download/text.txt", { method: "GET", headers: { "X-Api-Key": "12345"} })

// const __dirname = path.dirname(__filename);
const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (!checkApiKey(req.headers)) {
    sendError(res, 403, "Forbidden: Api key ether lost or invalid.");
    return;
  }
  if (method === "GET" && url.startsWith("/download/")) {
    const filename = url.substring(10);
    const filePath = path.join(__dirname, filename);
    emitter.emit("downloadStart", filename);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        sendError(res, 404, `File ${filename} was not found.`);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": stats.size,
        "Cache-Control": "public, max-age=3600",
      });
      const readStream = fs.createReadStream(filePath);
      readStream.on("end", () => {
        emitter.emit("downloadComplete", filename, stats.size);
      });
      readStream.on("error", () => {
        console.error(`Error when reading ${filename}:`, err);
      });
      readStream.pipe(res);
    });
  } else if (method === "POST" && url.startsWith("/upload/")) {
    const filename = url.substring(8);
    const filePath = path.join(__dirname, `uploaded_${filename}`);
    emitter.emit("uploadStart", filename);
    const writeStream = fs.createWriteStream(filePath);
    let bytesReceived = 0;
    req.on("data", (chunk) => {
      bytesReceived += chunk.length;
      if (bytesReceived % (1024 * 1024) < chunk.length) {
        emitter.emit("uploadProgress", filename, bytesReceived);
      }
    });
    req.on("end", () => {
      emitter.emit("uploadComplete", filename, bytesReceived);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: `File ${filename} uploaded`,
          size: bytesReceived,
        }),
      );
    });
    req.on("error", (err) => {
      console.error(`Error reading data:`, err);
      if (!res.headersSent) {
        sendError(res, 500, "Error uploading gile");
      }
    });
    req.pipe(writeStream);
  } else if (method === "GET" && url.startsWith("/stream/")) {
    const filename = url.substring(8);
    const filePath = path.join(__dirname, filename);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        sendError(res, 404, `File ${filename} was not found.`);
        return;
      }
      const range = req.headers.range;
      const fileSize = stats.size;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[0], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/mp4",
        });
        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
        emitter.emit("downloadStart", `${filename} (partial ${start}-${end})`);
        stream.on("end", () => {
          emitter.emit("downloadComplete", filename, chunkSize);
        });
      } else {
        res.writeHead(200, {
          "Cache-Control": "public, max-age=3600",
          "Accept-Ranges": "bytes",
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        emitter.emit("downloadStart", filename);
        stream.on("end", () => {
          emitter.emit("downloadComplete", filename, fileSize);
        });
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
        <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
          </head>
          <body>
             <h1>API:</h1> 
              <p>GET /download/{filename}</p>
              <p>POST /download/{filename}</p>
              <p>GET /stream/{filename}</p>
          </body>
          </html>
      `);
  }
});

// fetch("http://127.0.0.1:3333/stream/uploaded_text.txt", { method: "GET", headers: { "X-Api-Key": "12345"} })
