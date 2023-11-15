import { Request, Response } from "express";

async function getConversationWithParticipants(req: Request, res: Response) {}

async function getAllConversationsForUser(req: Request, res: Response) {}

async function getConversationById(req: Request, res: Response) {}

async function createConversation(req: Request, res: Response) {}

async function addMessageToConversation(req: Request, res: Response) {}

async function setConversationSeenForUserAndMessage(
    req: Request,
    res: Response
) {}

async function deleteConversation(req: Request, res: Response) {}

module.exports = {
    getConversationWithParticipants,
    getAllConversationsForUser,
    getConversationById,
    createConversation,
    addMessageToConversation,
    setConversationSeenForUserAndMessage,
    deleteConversation,
};
