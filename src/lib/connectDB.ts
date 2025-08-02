import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

export async function connectDB() {
  console.log("🔌 [DATABASE] Attempting to connect to MongoDB...");
  console.log("🧪 [DEBUG] MONGO_URI loaded as:", MONGO_URI);

  console.log("🔧 [DATABASE] Connection state:", {
    readyState: mongoose.connection.readyState,
    hasUri: !!MONGO_URI,
    uriLength: MONGO_URI?.length
  });
  
  if (mongoose.connection.readyState === 1) {
    console.log("✅ [DATABASE] Already connected to MongoDB");
    return;
  }

  if (mongoose.connection.readyState === 2) {
    console.log("⏳ [DATABASE] Connection already in progress...");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("✅ [DATABASE] MongoDB connected successfully:", {
      host: conn.connection.host,
      port: conn.connection.port,
      name: conn.connection.name,
      readyState: conn.connection.readyState
    });
  } catch (error: any) {
    console.error("❌ [DATABASE] MongoDB connection failed:", {
      error: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
} 