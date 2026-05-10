import fs from "fs";

const readStream = fs.createReadStream("sourceFile.jpg");
const writeStream = fs.createWriteStream("destinationFile.jpg");

readStream.pipe(writeStream);

writeStream.on("finish", () => {
  console.log("File copy completed!");
});

writeStream.on("error", (err) => {
  console.error("Error:", err.message);
});
