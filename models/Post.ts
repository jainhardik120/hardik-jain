import mongoose from "mongoose";

export interface IPost extends mongoose.Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);