import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import db_config from "./config.js";

const env = process.env.NODE_ENV || "development";
const config = db_config[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  { host: "127.0.0.1", dialect: "mysql" },
);

export default sequelize;
