import express from "express";
import { checkAuth } from "../middleware/auth";

const conversationRoutes = express.Router();

const conversationController = require("../controller/ConversationController");

conversationRoutes.get(
  "/",
  checkAuth,
  conversationController.getAllConversationsForUser
);

conversationRoutes.post(
  "/",
  checkAuth,
  conversationController.createConversation
);

conversationRoutes.post(
  "/see/:id",
  checkAuth,
  conversationController.setConversationSeenForUserAndMessage
);

conversationRoutes.delete(
  "/:id",
  checkAuth,
  conversationController.deleteConversation
);

conversationRoutes.post(
  "/:id",
  checkAuth,
  conversationController.addMessageToConversation
);

export default conversationRoutes;
