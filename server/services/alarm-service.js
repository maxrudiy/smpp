import AlarmModel from "../models/alarm-model.js";

const REGION = process.env.REGION;

class AlarmService {
  async getAlarms() {
    const alarmData = await AlarmModel.findOne({ region: REGION });
    if (!alarmData) {
      await AlarmModel.create({ ongoingAlarm: false, region: REGION });
    }

    const result = await AlarmModel.findOneAndUpdate({ region: REGION }, { ongoingAlarm: false }, { new: true });
    console.log(result);
  }
}

export default new AlarmService();
