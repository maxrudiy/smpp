import AlarmModel from "../models/alarm-model.js";

const REGION = process.env.REGION;
const ALARM_URL = process.env.ALARM_URL;

const fetchAlarms = async () => {
  try {
    const response = await fetch(ALARM_URL);
    if (response && response.status === 200) {
      return await response.json();
    }
  } catch (err) {
    console.log(err);
  }
};

class AlarmService {
  async getAlarms() {
    const alarmData = await AlarmModel.findOne({ region: REGION });
    if (!alarmData) {
      await AlarmModel.create({ ongoingAlarm: false, region: REGION });
    }

    setInterval(async () => {
      const data = await fetchAlarms();
      const result = await AlarmModel.findOneAndUpdate(
        { region: REGION },
        { ongoingAlarm: data.states[REGION].alertnow },
        { new: true }
      );
      console.log(result);
    }, 5000);
  }
}

export default new AlarmService();
