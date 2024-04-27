import TelegramBot from "node-telegram-bot-api";
import ControllerService from "./controller-service.js";
import MessageModel from "../models/message-model.js";

const TELEGRAM_BOT_API_KEY = process.env.TELEGRAM_BOT_API_KEY;

class TelegramService {
  async bot() {
    const bot = new TelegramBot(TELEGRAM_BOT_API_KEY, { polling: { interval: 1000, autoStart: true } });

    bot.on("polling_error", (err) => console.log(err));

    const optKeyboard = {
      parse_mode: "Markdown",
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [
          [
            {
              text: "Надати мій телефон",
              request_contact: true,
            },
          ],
        ],
      },
    };

    const optRemove = { reply_markup: { remove_keyboard: true } };

    bot.on("text", async (msg) => {
      bot.sendMessage(msg.chat.id, "Як ми можемо зв'язатися з Вами?", optKeyboard).then(() => {
        bot.once("contact", async (msg) => {
          await MessageModel.create({
            sourceAddr: msg.contact.phone_number,
            message: `Telegram: ${msg.contact.first_name} ${msg.contact.last_name}`,
          });
          console.log("Open");
          const result = await ControllerService.openDoor();
          console.log(result);
          bot.sendMessage(msg.chat.id, "Двері відкрито", optRemove);
        });
      });
    });
  }
}

export default new TelegramService();
