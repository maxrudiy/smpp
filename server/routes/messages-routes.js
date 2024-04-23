import express from "express";
import MessagesController from "../controllers/messages-controller.js";

const router = new express.Router();

router.get("/", MessagesController.getMessages);
router.delete("/", MessagesController.deleteMessages);

export { router as messagesRoutes };
