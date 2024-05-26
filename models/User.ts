import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
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
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);