import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  profilePic?: string;
};

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    validate: {
      validator: (email: string) => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email address!`,
    },
    required: [true, 'User email address required'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);