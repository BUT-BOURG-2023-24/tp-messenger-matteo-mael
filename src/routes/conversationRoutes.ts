import express from "express";
const router = express.Router();
import { checkAuth } from "../middleware/auth";
import conversationController from "../controller/conversationController";

router.get("/",checkAuth, conversationController.getAllConversationsForUser);
router.post("/", conversationController.createConversation);
router.post("/see/:id", conversationController.setConversationSeenForUserAndMessage);
router.delete("/:id", conversationController.deleteConversation);
router.post("/:id", conversationController.addMessageToConversation);

module.exports = router;