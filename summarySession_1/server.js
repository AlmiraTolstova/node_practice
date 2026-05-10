const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("event");
const emitter = new EventEmitter();

emitter.on("copyStart", (source, dest) => {
  console.log(`[START] Copying fils from ${source} to ${dest}`);
});
emitter.on("copyProgress", (bytes, source) => {
  console.log(`[PROGRESS] Copied ${bytes} from ${source}`);
});
emitter.on("copyComplete", (source, dest) => {
  console.log(`[COMPLETED] Copying fils finished: ${source} -> ${dest}`);
});
emitter.on("copyError", (source, error) => {
  console.log(`[ERROR] While copying ${source}: ${error}`);
});

function copyFile(src, dest, res, isLarge = false) {
  if (!fs.existsSync(src)) {
    emitter.emit("copyError", new Error("Файл не найден"));
    res.writeHead(404);
    return res.end("Файл не найден");
  }

  emitter.emit("copyStart");

  const readStream = fs.createReadStream(src);
  const writeStream = fs.createWriteStream(dest);

  let buffer = 0;

  readStream.on("data", (chunk) => {
    if (isLarge) {
      buffer += chunk.length;
      if (buffer >= 64 * 1024) {
        emitter.emit("copyProgress");
        buffer = 0;
      }
    } else {
      emitter.emit("copyProgress");
    }
  });

  readStream.on("error", (err) => {
    emitter.emit("copyError", err);
    res.writeHead(500);
    res.end("Ошибка чтения");
  });

  writeStream.on("error", (err) => {
    emitter.emit("copyError", err);
    res.writeHead(500);
    res.end("Ошибка записи");
  });

  writeStream.on("finish", () => {
    emitter.emit("copyComplete");
    res.writeHead(200);
    res.end("OK");
  });

  readStream.pipe(writeStream);
}

http
  .createServer((req, res) => {
    const url = req.url;

    if (url === "/copy/small") {
      copyFile(
        path.join(__dirname, "small.txt"),
        path.join(__dirname, "small_copy.txt"),
        res,
        true,
      );
    } else if (url === "/copy/image") {
      copyFile(
        path.join(__dirname, "photo.jpg"),
        path.join(__dirname, "photo_copy.jpg"),
        res,
      );
    } else if (url === "/copy/backup") {
      const backupDir = path.join(__dirname, "backup");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }
      copyFile(
        path.join(__dirname, "data.txt"),
        path.join(backupDir, "data.txt"),
        res,
      );
    } else {
      res.writeHead(404);
      res.end("Route not found");
    }
  })
  .listen(3333, () => {
    console.log("Server on port 3333");
  });

//   readStream.on("error", (err) => {
//     emitter.emit("copyError", source, err);
//     res.statusCode = 404;
//     res.end(`Error: Source file ${source} was not found.`);
//   });
//   writeStream.on("error", (err) => {
//     emitter.emit("copyError", dest, err.message);
//     res.statusCode = 500;
//     res.end(`Error: Failed copying file.`);
//   });

// function copyFileWithStreams(source, dest, res, onProgress) {
//   emitter.emit("copyStart", source, dest);
//   const readStream = fs.createReadStream(source);
//   const writeStream = fs.createWriteStream(dest);
//   let bytesCopied = 0;
//   readStream.on("data", (chunk) => {
//     bytesCopied += chunk.length;
//     if (onProgress) {
//       onProgress(bytesCopied);
//     }
//     emitter.emit("copyProgress", bytesCopied, source);
//   });
//   readStream.on("error", (err) => {
//     emitter.emit("copyError", source, err);
//     res.statusCode = 404;
//     res.end(`Error: Source file ${source} was not found.`);
//   });
//   writeStream.on("error", (err) => {
//     emitter.emit("copyError", dest, err.message);
//     res.statusCode = 500;
//     res.end(`Error: Failed copying file.`);
//   });
//   writeStream.on("finish", () => {
//     emitter.emit("copyComplete", source, dest);
//     res.statusCode = 200;
//     res.end(`File ${source} was successfully copied to ${dest}`);
//   });
//   readStream.pipe(writeStream);
// }
