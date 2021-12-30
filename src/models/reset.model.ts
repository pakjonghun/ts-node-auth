import { Document, model, Schema } from "mongoose";

interface Reset extends Document {
  email: string;
  token: string;
}

const resetSchema = new Schema<Reset>({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
});

export default model<Reset>("Reset", resetSchema);
