import MessageModel from "../models/message-model.js";

class MessagesController {
  async getMessages(req, res, next) {
    try {
      const messagesData = await MessageModel.find().sort({ createdAt: -1 });
      res.json(messagesData);
    } catch (err) {
      console.log(err);
    }
  }
  async deleteMessages(req, res, next) {
    try {
      const result = await MessageModel.deleteMany();
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new MessagesController();
