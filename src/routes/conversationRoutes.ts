const express = require("express");
const router = express.Router();

const conversationController = require("../controller/ConversationController");

router.get("/", conversationController.getAllConversationsForUser);
router.post("/", conversationController.createConversation);
router.post(
  "/see/:id",
  conversationController.setConversationSeenForUserAndMessage
);
router.delete("/:id", conversationController.deleteConversation);
router.post("/:id", conversationController.addMessageToConversation);
