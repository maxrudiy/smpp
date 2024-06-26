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
      try {
        const data = await fetchAlarms();
        const ongoingAlarm = data ? data.states[REGION].alertnow : true;
        const result = await AlarmModel.findOneAndUpdate({ region: REGION }, { ongoingAlarm }, { new: true });
      } catch (err) {
        console.log(err);
      }
    }, 10000);
  }
}

export default new AlarmService();
