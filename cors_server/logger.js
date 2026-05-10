import EventEmitter from "events";

const emitter = new EventEmitter();

emitter.on("authSuccess", (token) => {
  console.log(`[AUTH] Success login with token: ${token}`);
});

emitter.on("authFailed", (reason) => {
  console.log(`[AUTH] Failed to log in: ${reason}`);
});

emitter.on("fileAccess", (filename) => {
  console.log(`[ACCESS] Requested file: ${filename}`);
});

emitter.on("fileWrite", (filename, size) => {
  console.log(`[WRITE] Created/edited file: ${filename}, size: ${size} bytes`);
});

emitter.on("fileDelete", (filename) => {
  console.log(`[DELETE] Deleted file: ${filename}`);
});

export default emitter;
