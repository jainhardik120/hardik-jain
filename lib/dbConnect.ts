import Session from "@/models/Session";
import Skill from "@/models/Skill";
import User from "@/models/User";
import mongoose from "mongoose";

declare global {
  var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(`${MONGODB_URI}/hardik-jain`, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  if (!mongoose.models.User) {
    await User.findOne({ email: 'test@test.com' });
  }
  if (!mongoose.models.Skill) {
    await Skill.findOne({ name: '' });
  }
  if (!mongoose.models.Session) {
    await Session.find({});
  }
  return cached.conn;
}

export default dbConnect;