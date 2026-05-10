import fs from "fs";
const readStream = fs.createReadStream("largeFile.txt", "utf-8");

readStream.on("data", (chunk) => {
  console.log("CHUNK:");
  console.log(chunk);
});

readStream.on("end", () => {
  console.log("Reading completed!");
});

readStream.on("error", (err) => {
  console.error("Error:", err.message);
});
