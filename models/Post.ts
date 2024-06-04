import mongoose, { Schema } from "mongoose";
import { IUser } from "./User";  

export interface IPost extends mongoose.Document {
  title?: string;
  content?: string;
  description?: string;
  author: IUser['_id']; 
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String
  },
  content: {
    type: String
  },
  description: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
