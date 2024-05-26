import mongoose from "mongoose";

export interface SubSkill {
  name: string;
  level: string;
}

export interface ISkill extends mongoose.Document {
  name: string;
  skills: SubSkill[];
  createdAt: Date;
  updatedAt: Date;
};

const SubSkillSchema = new mongoose.Schema<SubSkill>({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  }
});

const SkillSchema = new mongoose.Schema<ISkill>({
  name: {
    type: String,
    required: true,
  },
  skills: {
    type: [SubSkillSchema],
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
