import mongoose from "mongoose";

export interface IPost extends mongoose.Document {
  title?: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
};

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String
  },
  content: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);