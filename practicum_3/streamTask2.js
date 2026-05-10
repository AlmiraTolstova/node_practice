import fs from "fs";
const writeStream = fs.createWriteStream("output.txt");

const data = "Hello World!\n".repeat(10);

writeStream.write(data);

writeStream.end();

writeStream.on("finish", () => {
  console.log("Writing completed!");
});

writeStream.on("error", (err) => {
  console.error("Error:", err.message);
});
