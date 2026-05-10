import EventEmitter from "events";

const emitter = new EventEmitter();

emitter.on("downloadStart", (filename) => {
  console.log(`[DOWNLOADING] Started downloading file: ${filename}`);
});
emitter.on("downloadComplete", (filename, size) => {
  console.log(`[COMPLETED] Downloaded file: ${filename}, size: ${size} bytes`);
});
emitter.on("uploadStart", (filename) => {
  console.log(`[UPLOADING] Started uploading file to the server: ${filename}`);
});
emitter.on("uploadProgress", (filename, bytes) => {
  console.log(`[PROGRESS]  ${filename}: uploaded ${bytes} bytes`);
});
emitter.on("uploadComplete", (filename, size) => {
  console.log(`[COMPLETED] Uploaded file: ${filename}, size: ${size} bytes`);
});

export default emitter;
