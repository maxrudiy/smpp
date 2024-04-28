import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    sourceAddr: { type: String, required: true },
    method: { type: String, required: true },
    message: { type: String, required: true },
    result: Boolean,
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
