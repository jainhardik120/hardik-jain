import mongoose from "mongoose";

export interface ISession extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const SessionSchema = new mongoose.Schema<ISession>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);