import http from "http";
import emitter from "./events.js";

const port = 3333;
const host = "127.0.0.1";

const server = http.createServer((req, res) => {
  const path = req.url;

  if (path === "/") {
    emitter.emit("home");
    res.statusCode = 200;
    res.end("Welcome to the home page");
  } else if (path === "/about") {
    emitter.emit("about");
    res.statusCode = 200;
    res.end("About us page");
  } else if (path === "/contact") {
    emitter.emit("contact");
    res.statusCode = 200;
    res.end("Contact page");
  } else {
    emitter.emit("notFound");
    res.statusCode = 404;
    res.end("404 Not Found");
  }
});

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
