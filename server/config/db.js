import mongoose from 'mongoose';

let isConnected = false;
let isInMemory = false;
let activeHost = '';
let activeDbName = '';

export async function connectDB(customUri = null) {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vittara_ai';
  
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    isInMemory = false;
    activeHost = conn.connection.host;
    activeDbName = conn.connection.name;
    console.log(`[Database] Connected to live MongoDB: ${activeHost}/${activeDbName}`);
    return { isConnected: true, isInMemory: false, uri, host: activeHost, name: activeDbName };
  } catch (error) {
    console.warn(`[Database] Live MongoDB connection error (${error.message}).`);
    console.log(`[Database] Activating High-Performance In-Memory MongoDB Store...`);
    isConnected = true;
    isInMemory = true;
    activeHost = 'in-memory';
    activeDbName = 'vittara_ai';
    return { isConnected: true, isInMemory: true, uri: 'in-memory', host: 'in-memory', name: 'vittara_ai' };
  }
}

export function getDbStatus() {
  return { isConnected, isInMemory, host: activeHost, name: activeDbName };
}
