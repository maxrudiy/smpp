import { model, Schema } from "mongoose";

const AlarmSchema = new Schema({
  ongoingAlarm: { type: Boolean, required: true },
});

export default model("Alarm", AlarmSchema);
