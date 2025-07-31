import mongoose from "mongoose";

// Only access environment variables at runtime, not at build time
const getMongoDB_URI = () => {
  // Skip database connection during build time
  if (process.env.BUILD_TIME === "true") {
    throw new Error("Database connection not available during build time");
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  return uri;
};

let cached: any = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Get MongoDB URI at runtime, not at module load time
    const MONGODB_URI = getMongoDB_URI();

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
