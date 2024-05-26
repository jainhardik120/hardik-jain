import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

const MessageSchema = new mongoose.Schema<IMessage>({
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
  },
  subject: {
    type: String,
    required: [true, 'Message subject required'],
  },
  message: {
    type: String,
    required: [true, 'Message content required'],
  },
}, {
  timestamps: true
});

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
