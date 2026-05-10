import axios from "axios";
import fs from "fs";

const url = "https://jsonplaceholder.typicode.com/posts";

axios
  .get(url)
  .then((response) => {
    const data = JSON.stringify(response.data, null, 2);

    fs.writeFileSync("posts.txt", data, "utf-8");

    console.log("Posts saved to posts.txt");

    const fileContent = fs.readFileSync("posts.txt", "utf-8");
    console.log("File content:");
    console.log(fileContent);
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });
