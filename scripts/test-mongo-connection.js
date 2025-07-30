#!/usr/bin/env node

const { MongoClient } = require("mongodb");
const path = require("path");
const fs = require("fs");

// Load .env.local if exists, otherwise load .env
const envLocalPath = path.join(__dirname, "..", ".env.local");
const envPath = path.join(__dirname, "..", ".env");

if (fs.existsSync(envLocalPath)) {
  require("dotenv").config({ path: envLocalPath });
  console.log("📄 Using .env.local for configuration");
} else {
  require("dotenv").config({ path: envPath });
  console.log("📄 Using .env for configuration");
}

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log("Testing MongoDB connection...");
  console.log("URI:", uri);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");

    // List databases to verify connection
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log("Available databases:");
    dbs.databases.forEach((db) => console.log(`  - ${db.name}`));
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
  } finally {
    await client.close();
  }
}

testConnection();
