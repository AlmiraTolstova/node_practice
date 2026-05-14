import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Products",
    timestamps: true,
  },
);

export default Product;
