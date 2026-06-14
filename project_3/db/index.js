import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGO_URI || "uri";
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(uri);
    console.log(`MongoDB Connected!`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
export default connectDB;
