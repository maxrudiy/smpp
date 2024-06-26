import smpp from "smpp";
import ControllerService from "./controller-service.js";
import MessageModel from "../models/message-model.js";
import AlarmModel from "../models/alarm-model.js";

//SMPP
const SMPP_IP = process.env.SMPP_IP;
const SMPP_PORT = process.env.SMPP_PORT;
const SMPP_SYSTEM_ID = process.env.SMPP_SYSTEM_ID;
const SMPP_PASSWORD = process.env.SMPP_PASSWORD;

const REGION = process.env.REGION;

const smppService = () => {
  try {
    const session = smpp.connect({
      url: `smpp://${SMPP_IP}:${SMPP_PORT}`,
      auto_enquire_link_period: 30000,
      debug: false,
    });

    session.on("connect", () => {
      session.bind_transceiver({ system_id: SMPP_SYSTEM_ID, password: SMPP_PASSWORD }, (pdu) => {
        if (pdu.command_status == 0) {
          console.log("Successfully bound");
        }
      });
    });

    session.on("close", () => {
      console.log("SMPP is now disconnected");
      setTimeout(() => {
        session.connect();
        session.resume();
      }, 30000);
    });

    session.on("error", (err) => {
      console.log("SMPP error", err);
    });

    session.on("pdu", async (pdu) => {
      if (pdu.command === "deliver_sm") {
        session.deliver_sm_resp({ sequence_number: pdu.sequence_number });

        const message = pdu.short_message.message || pdu.message_payload.message;
        const messageData = await MessageModel.create({
          sourceAddr: pdu.source_addr,
          method: "SMPP",
          message: `${message}`,
        });

        const alarmData = await AlarmModel.findOne({ region: REGION });
        if (alarmData.ongoingAlarm) {
          const result = await ControllerService.openDoor();
          messageData.result = true;
          await messageData.save();
        } else {
          messageData.result = false;
          await messageData.save();
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// const sendSMS = (to, text) => {
//   session.submit_sm(
//     {
//       destination_addr: to,
//       short_message: text,
//     },
//     (pdu) => {
//       if (pdu.command_status == 0) {
//         console.log(pdu.message_id);
//       }
//     }
//   );
// };

export { smppService };
