import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error("DB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message || error}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      console.log("MongoDB disconnected successfully");
    }
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};

export { connectDB, disconnectDB };