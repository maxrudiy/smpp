import { model, Schema } from "mongoose";

const AlarmSchema = new Schema({
  ongoingAlarm: { type: Boolean, required: true },
  region: { type: String, required: true, unique: true },
});

export default model("Alarm", AlarmSchema);
