import ControllerService from "./controller-service.js";
import MessageModel from "../models/message-model.js";
import { Telegraf, Markup, session } from "telegraf";
import { message } from "telegraf/filters";
import AlarmModel from "../models/alarm-model.js";

const REGION = process.env.REGION;
const TELEGRAM_BOT_API_KEY = process.env.TELEGRAM_BOT_API_KEY;

class TelegramService {
  async bot() {
    const bot = new Telegraf(TELEGRAM_BOT_API_KEY);
    bot.use(session());

    bot.command("open", (ctx) => {
      return ctx.reply(
        "Залиште свій номер телефону",
        Markup.keyboard([Markup.button.contactRequest("Надати мій номер телефону")]).resize()
      );
    });

    bot.on(message("contact"), async (ctx) => {
      const contact = ctx.message.contact.phone_number;
      const firstName = ctx.message.contact.first_name;
      const lastName = ctx.message.contact.last_name;
      const userId = ctx.message.contact.user_id;
      await MessageModel.create({
        sourceAddr: contact,
        method: "Telegram",
        message: `Ім'я: ${firstName}, прізвище: ${lastName}, id: ${userId}`,
      });

      const alarmData = await AlarmModel.findOne({ region: REGION });
      if (alarmData.ongoingAlarm) {
        const result = await ControllerService.openDoor();
        console.log(result);
        await ctx.reply("Двері відкрито", Markup.removeKeyboard());
      } else {
        await ctx.reply(`Помилка. Тривога у "${REGION}" відсутня`, Markup.removeKeyboard());
      }
    });

    bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }
}

export default new TelegramService();
