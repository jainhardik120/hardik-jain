import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  name: string;
  githubLink?: string;
  demoLink?: string;
  category: string;
  imageUrl: string;
  content: string;
  shortDescription: string;
  createdAt: Date;
  updatedAt: Date;
  techStack: string[];
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
  },
  githubLink: {
    type: String,
  },
  demoLink: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  shortDescription: {
    type : String,
    required : true
  },
  techStack : {
    type : [String],
    required : true
  }
}, {
  timestamps: true,
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);