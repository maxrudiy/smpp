import ControllerService from "./controller-service.js";
import MessageModel from "../models/message-model.js";
import { Markup, Scenes } from "telegraf";
import AlarmModel from "../models/alarm-model.js";

const ADMINS = process.env.ADMINS.split(",");
const REGION = process.env.REGION;

const getMessagesScene = new Scenes.WizardScene(
  "GET_MESSAGES",
  (ctx) => {
    ctx.reply(
      'Натисніть кнопку "Надати мій номер телефону" нижче',
      Markup.keyboard([Markup.button.contactRequest("Надати мій номер телефону")]).resize()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message.contact) {
      ctx.reply(
        "Помилка. Спробуйте ще раз",
        Markup.keyboard([Markup.button.contactRequest("Надати мій номер телефону")]).resize()
      );
      return;
    } else if (ADMINS.includes(ctx.message.contact.phone_number)) {
      const messages = await MessageModel.find().sort({ createdAt: -1 }).limit(20);

      let formattedMessages = "";
      for (const message of messages) {
        formattedMessages += `
Час: ${message.createdAt.toLocaleString("uk-UA")} 
Телефон: ${message.sourceAddr}
Дані: ${message.message}
Метод: ${message.method}
Доступ: ${message.result}
`;
      }

      ctx.reply(formattedMessages, Markup.removeKeyboard());
      return ctx.scene.leave();
    } else {
      ctx.reply("Доступ відсутній", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
  }
);

const openBasementDoorScene = new Scenes.WizardScene(
  "OPEN_BASEMENT_DOOR",
  (ctx) => {
    ctx.reply(
      'Натисніть кнопку "Надати мій номер телефону" нижче',
      Markup.keyboard([Markup.button.contactRequest("Надати мій номер телефону")]).resize()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message.contact) {
      ctx.reply(
        "Помилка. Спробуйте ще раз",
        Markup.keyboard([Markup.button.contactRequest("Надати мій номер телефону")]).resize()
      );
      return;
    }
    const contact = ctx.message.contact.phone_number;
    const firstName = ctx.message.contact.first_name;
    const lastName = ctx.message.contact.last_name;
    const userId = ctx.message.contact.user_id;
    const messageData = await MessageModel.create({
      sourceAddr: contact,
      method: "Telegram",
      message: `Ім'я: ${firstName}, прізвище: ${lastName}, id: ${userId}`,
    });

    const alarmData = await AlarmModel.findOne({ region: REGION });
    if (alarmData.ongoingAlarm) {
      const result = await ControllerService.openDoor();
      messageData.result = true;
      await messageData.save();
      ctx.reply("Двері відкрито", Markup.removeKeyboard());
      return ctx.scene.leave();
    } else {
      messageData.result = false;
      await messageData.save();
      ctx.reply(`Помилка. Тривога у "${REGION}" відсутня`, Markup.removeKeyboard());
      return ctx.scene.leave();
    }
  }
);

export { getMessagesScene, openBasementDoorScene };
