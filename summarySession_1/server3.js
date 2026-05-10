const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const emitter = new EventEmitter();
const host = "127.0.0.1";
const port = 3333;

// ---------------- EVENTS ----------------
emitter.on("copyStart", (source, dest) => {
  console.log(`[НАЧАЛО] Копирование файла начато: ${source} -> ${dest}`);
});

emitter.on("copyProgress", (bytes, source) => {
  console.log(`[ПРОГРЕСС] ${source}: ${bytes} bytes`);
});

emitter.on("copyComplete", (source, dest) => {
  console.log(`[ЗАВЕРШЕНО] ${source} -> ${dest}`);
});

emitter.on("copyError", (source, error) => {
  console.log(`[ОШИБКА] ${source}: ${error.message || error}`);
});

// ---------------- SERVER ----------------
const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === "/") {
    return res.end("File operations server");
  }

  // -------- SMALL --------
  if (url === "/copy/small") {
    const source = "small.txt";
    const dest = "small_copy.txt";

    return copyWithStreams(source, dest, res);
  }

  // -------- LARGE (64KB progress) --------
  if (url === "/copy/large") {
    const source = "large.txt";
    const dest = "large_copy.txt";

    return copyWithStreams(source, dest, res, 64 * 1024);
  }

  // -------- IMAGE --------
  if (url === "/copy/image") {
    const source = "photo.jpg";
    const dest = "photo_copy.jpg";

    return copyWithStreams(source, dest, res);
  }

  // -------- BACKUP --------
  if (url === "/copy/backup") {
    const backupDir = path.join(__dirname, "backup");

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const source = "data.txt";
    const dest = path.join(backupDir, "data.txt");

    return copyWithStreams(source, dest, res);
  }

  res.statusCode = 404;
  res.end("Route not found");
});

// ---------------- COPY FUNCTION ----------------
function copyWithStreams(source, dest, res, progressChunk = 0) {
  if (!fs.existsSync(source)) {
    emitter.emit("copyError", source, "File not found");
    res.statusCode = 404;
    return res.end(`Error: file ${source} not found`);
  }

  emitter.emit("copyStart", source, dest);

  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(dest);

  let bytesCopied = 0;
  let buffer = 0;

  readStream.on("data", (chunk) => {
    bytesCopied += chunk.length;

    if (progressChunk > 0) {
      buffer += chunk.length;

      if (buffer >= progressChunk) {
        emitter.emit("copyProgress", bytesCopied, source);
        buffer = 0;
      }
    } else {
      emitter.emit("copyProgress", bytesCopied, source);
    }
  });

  readStream.on("error", (err) => {
    emitter.emit("copyError", source, err);
    res.statusCode = 404;
    res.end("Read error");
  });

  writeStream.on("error", (err) => {
    emitter.emit("copyError", dest, err);
    res.statusCode = 500;
    res.end("Write error");
  });

  writeStream.on("finish", () => {
    emitter.emit("copyComplete", source, dest);
    res.statusCode = 200;
    res.end(`Copied ${source} -> ${dest}`);
  });

  readStream.pipe(writeStream);
}

// ---------------- START ----------------
server.listen(port, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
