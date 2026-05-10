import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import emitter from "./logger.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_TOKEN = process.env.VALID_TOKEN;
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;
  console.log(`${method} ${url}`);

  if (url === "/") {
    res.end("Home Page");
    return;
  }

  if (method === "GET" && url === "/list") {
    if (!checkAuth(headers, res)) {
      return;
    }

    fs.readdir(__dirname, (err, files) => {
      if (err) {
        sendJsonResponse(res, 500, { error: "Error reading directory" });
        return;
      }

      const fileList = files.filter((file) => {
        try {
          const filePath = path.join(__dirname, file);
          return fs.statSync(filePath).isFile();
        } catch (error) {
          return false;
        }
      });

      sendJsonResponse(res, 200, { files: fileList });
    });
    return;
  }

  // url = /files/example.txt
  if (url.startsWith("/files/")) {
    const filename = url.substring(7);
    const filePath = path.join(__dirname, filename);

    if (!checkAuth(headers, res)) {
      return;
    }

    if (method === "GET") {
      emitter.emit("fileAccess", filename);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          sendJsonResponse(res, 404, { error: `File ${filename} not found` });
        } else {
          sendJsonResponse(res, 200, { content: data });
        }
      });
      return;
    } else if (method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const contentToWrite = body || "Hello example text content";

        fs.writeFile(filePath, contentToWrite, "utf8", (err) => {
          if (err) {
            sendJsonResponse(res, 500, { error: "Error when writing file" });
          } else {
            emitter.emit("fileWrite", filename, contentToWrite.length);
            sendJsonResponse(res, 200, {
              message: `File ${filename} was successfully written`,
              size: contentToWrite.length,
            });
          }
        });
      });

      req.on("error", (err) => {
        sendJsonResponse(res, 500, { error: "Error reading request body" });
      });
      return;
    } else if (method === "DELETE") {
      fs.unlink(filePath, (err) => {
        if (err) {
          sendJsonResponse(res, 404, { error: `File ${filename} not found` });
        } else {
          emitter.emit("fileDelete", filename);
          sendJsonResponse(res, 200, {
            message: `File ${filename} was successfully deleted`,
          });
        }
      });
      return;
    } else {
      sendJsonResponse(res, 405, { error: "Method not Allowed" });
      return;
    }
  }

  sendJsonResponse(res, 404, {
    error: "Not Found",
    message: "Path is not found",
  });
});

function checkAuth(headers, res) {
  const authHeader = headers["authorization"];

  if (!authHeader) {
    emitter.emit("authFailed", "Token is not provided");
    sendJsonResponse(res, 401, {
      error: "Unauthorized",
      message: "Token is not provided",
    });
    return false;
  }

  if (authHeader !== VALID_TOKEN) {
    emitter.emit("authFailed", "Token is not valid");
    sendJsonResponse(res, 401, {
      error: "Unauthorized",
      message: "Token is invalid",
    });
    return false;
  }

  emitter.emit("authSuccess", VALID_TOKEN);
  return true;
}

function sendJsonResponse(res, statusCode, data) {
  setCorsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

server.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
