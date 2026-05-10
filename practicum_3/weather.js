import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const CITY = process.env.CITY;

const url = `https://wttr.in/${CITY}?format=%t`;

axios
  .get(url)
  .then((res) => {
    console.log(`Temperature in ${CITY}: ${res.data}`);
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });
