import { Request, Response } from "express";
import ConversationModel, {
  IConversation,
} from "../database/Mongo/Models/ConversationModel";
import ConversationRepository from "../repository/conversationRepository";

const conversationRepository = new ConversationRepository();

async function getConversationWithParticipants(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

async function getAllConversationsForUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const conversations =
      await conversationRepository.getAllConversationsForUser();
    return res.status(200).json(conversations);
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
}

async function getConversationById(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const conversation = await conversationRepository.getConversationById(
      req.params.id
    );
    if (!conversation) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
}

async function createConversation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    if (!req.body.concernedUserIds || req.body.concernedUserIds.length < 2) {
      return res.status(400).json({ error: "Bad request" });
    }
    const newConversation = await conversationRepository.createConversation(
      req.body.concernedUserIds
    );
    return res.status(200).json({ conversation: newConversation });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
}

async function addMessageToConversation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    if (!req.body.content) {
      return res.status(401).json({ error: "Bad Request" });
    }
    const conversationId = req.params.id;
    const result = await conversationRepository.addMessageToConversation(
      conversationId,
      req.body.content,
      req.body.messageReplyId ?? null
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
}

async function setConversationSeenForUserAndMessage(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    if (!req.body.messageId) {
      return res.status(401).json({ error: "Bad request" });
    }
    const result =
      await conversationRepository.setConversationSeenForUserAndMessage(
        req.params.id,
        req.body.messageId
      );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
}

async function deleteConversation(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const deletedConversation =
      await conversationRepository.deleteConversationById(req.params.id);
    if (!deletedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    return res.status(200).json({ conversation: deletedConversation });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
}

module.exports = {
  getConversationWithParticipants,
  getAllConversationsForUser,
  getConversationById,
  createConversation,
  addMessageToConversation,
  setConversationSeenForUserAndMessage,
  deleteConversation,
};
