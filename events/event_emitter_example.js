const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("hello", () => {
  console.log("hello my app");
});

emitter.emit("hello");

emitter.once("connect", () => {
  console.log("Connect only one time!");
});
emitter.emit("connect");
