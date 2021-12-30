import { Document, model, Schema } from "mongoose";

export interface User extends Document {
  firstName: string;
  lastName: String;
  email: string;
  password: string;
}

const schema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
});

export default model<User>("User", schema);
