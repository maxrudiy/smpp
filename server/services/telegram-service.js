import { Telegraf, session, Scenes } from "telegraf";
import { getMessagesScene, openBasementDoorScene } from "./telegram-service-scenes.js";

const TELEGRAM_BOT_API_KEY = process.env.TELEGRAM_BOT_API_KEY;

class TelegramService {
  async bot() {
    const bot = new Telegraf(TELEGRAM_BOT_API_KEY);
    const stage = new Scenes.Stage([getMessagesScene, openBasementDoorScene]);

    bot.use(session());
    bot.use(stage.middleware());

    bot.command("messages", (ctx) => ctx.scene.enter("GET_MESSAGES"));
    bot.command("open", (ctx) => ctx.scene.enter("OPEN_BASEMENT_DOOR"));

    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }
}

export default new TelegramService();
