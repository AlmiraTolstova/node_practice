// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const EventEmitter = require("events");
// const emitter = new EventEmitter();
// const host = "127.0.0.1";
// const port = 3333;
// emitter.on("copyStart", (source, dest) => {
//   console.log(`[START] Copying fils from ${source} to ${dest}`);
// });
// emitter.on("copyProgress", (bytes, source) => {
//   console.log(`[PROGRESS] Copied ${bytes} from ${source}`);
// });
// emitter.on("copyComplete", (source, dest) => {
//   console.log(`[COMPLETED] Copying fils finished: ${source} -> ${dest}`);
// });
// emitter.on("copyError", (source, error) => {
//   console.log(`[ERROR] While copying ${source}: ${error}`);
// });
// const server = http.createServer((req, res) => {
//   const url = req.url;
//   if (url === "/") {
//     res.end("File operations server");
//   } else if (url === "/copy/small") {
//     const source = "small.txt";
//     const dest = "small_copy.txt";
//     fs.access(source, fs.constants.F_OK, (err) => {
//       if (err) {
//         emitter.emit("copyError", source, "File was not found");
//         res.statusCode = 404;
//         res.end(
//           `Error: file ${source} was not found. You need to create it with /create/small`,
//         );
//       } else {
//         copyFileWithStreams(source, dest, res);
//       }
//     });
//   } else if (url === "/copy/large") {
//   } else if (url === "/copy/image") {
//   } else if (url === "/copy/backup") {
//   } else if (url === "/create/small") {
//   } else if (url === "/create/large") {
//   } else if (url === "/create/data") {
//   }
// });
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
// server.listen(port, () => {
//   console.log(`Server is running at http://${host}:${port}`);
// });

const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const emitter = new EventEmitter();
const host = "127.0.0.1";
const port = 3333;

// -------------------- EVENTS --------------------
emitter.on("copyStart", (source, dest) => {
  console.log(`[START] Copying file from ${source} to ${dest}`);
});

emitter.on("copyProgress", (bytes, source) => {
  console.log(`[PROGRESS] Copied ${bytes} bytes from ${source}`);
});

emitter.on("copyComplete", (source, dest) => {
  console.log(`[COMPLETED] ${source} -> ${dest}`);
});

emitter.on("copyError", (source, error) => {
  console.log(`[ERROR] ${source}: ${error.message || error}`);
});

// -------------------- HELPERS --------------------
function send(res, status, data) {
  if (!res.writableEnded) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }
}

function createFile(name, size = "small") {
  return new Promise((resolve, reject) => {
    let content = "";

    if (size === "small") {
      content = "Hello Node.js!";
    } else if (size === "large") {
      content = "A".repeat(5 * 1024 * 1024); // 5MB
    } else if (size === "data") {
      content = JSON.stringify({ time: Date.now() }, null, 2);
    }

    fs.writeFile(name, content, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// -------------------- COPY --------------------
function copyFileWithStreams(source, dest, res) {
  emitter.emit("copyStart", source, dest);

  fs.stat(source, (err, stats) => {
    if (err) {
      emitter.emit("copyError", source, err);
      return send(res, 404, { error: "Source file not found" });
    }

    const totalSize = stats.size;

    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(dest);

    let bytesCopied = 0;

    readStream.on("data", (chunk) => {
      bytesCopied += chunk.length;

      const percent = ((bytesCopied / totalSize) * 100).toFixed(2);

      emitter.emit(
        "copyProgress",
        `${bytesCopied} bytes (${percent}%)`,
        source,
      );
    });

    readStream.on("error", (err) => {
      emitter.emit("copyError", source, err);
      send(res, 404, { error: "Read error" });
    });

    writeStream.on("error", (err) => {
      emitter.emit("copyError", dest, err);
      send(res, 500, { error: "Write error" });
    });

    writeStream.on("finish", () => {
      emitter.emit("copyComplete", source, dest);
      send(res, 200, {
        message: "Copy successful",
        source,
        dest,
        size: totalSize,
      });
    });

    readStream.pipe(writeStream);
  });
}

// -------------------- SERVER --------------------
const server = http.createServer(async (req, res) => {
  const url = req.url;

  try {
    // ---------- ROOT ----------
    if (url === "/") {
      return send(res, 200, { message: "File API server" });
    }

    // ---------- COPY SMALL ----------
    if (url === "/copy/small") {
      return copyFileWithStreams("small.txt", "small_copy.txt", res);
    }

    // ---------- COPY LARGE (С ИСПРАВЛЕНИЕМ) ----------
    if (url === "/copy/large") {
      const source = "large.txt";
      const dest = "large_copy.txt";

      fs.access(source, fs.constants.F_OK, (err) => {
        if (err) {
          emitter.emit("copyError", source, "File was not found");
          res.statusCode = 404;
          res.end(
            `Error: file ${source} was not found. You need to create it with /create/large`,
          );
        } else {
          copyFileWithStreams(source, dest, res);
        }
      });

      return;
    }

    // ---------- COPY IMAGE ----------
    if (url === "/copy/image") {
      return copyFileWithStreams("photo.jpg", "photo_copy.jpg", res);
    }

    // ---------- COPY BACKUP ----------
    if (url === "/copy/backup") {
      const backupDir = path.join(__dirname, "backup");

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }

      return copyFileWithStreams(
        "data.txt",
        path.join(backupDir, "data.txt"),
        res,
      );
    }

    // ---------- CREATE SMALL ----------
    if (url === "/create/small") {
      await createFile("small.txt", "small");
      return send(res, 201, { message: "small.txt created" });
    }

    // ---------- CREATE LARGE ----------
    if (url === "/create/large") {
      await createFile("large.txt", "large");
      return send(res, 201, { message: "large.txt created" });
    }

    // ---------- CREATE DATA ----------
    if (url === "/create/data") {
      await createFile("data.txt", "data");
      return send(res, 201, { message: "data.txt created" });
    }

    // ---------- NOT FOUND ----------
    send(res, 404, { error: "Route not found" });
  } catch (err) {
    emitter.emit("copyError", "server", err);
    send(res, 500, { error: "Internal server error" });
  }
});

// -------------------- START --------------------
server.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
