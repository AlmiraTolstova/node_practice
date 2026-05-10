import EventEmitter from "node:events";

const emitter = new EventEmitter();

// event handlers
emitter.on("home", () => {
  console.log("Home page requested");
});

emitter.on("about", () => {
  console.log("About page requested");
});

emitter.on("contact", () => {
  console.log("Contact page requested");
});

emitter.on("notFound", () => {
  console.log("Non-existing page requested");
});

export default emitter;
