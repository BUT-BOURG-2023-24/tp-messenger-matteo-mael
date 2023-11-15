import {Request, Response} from "express";
import ConversationRepository from "../repository/conversationRepository";
import {IUser} from "../database/Mongo/Models/UserModel";
import userRepository from "../repository/userRepository";

const conversationRepository = new ConversationRepository();

class ConversationController {

    public async getConversationWithParticipants(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json();
        } catch (error) {
            return res.status(500).json({message: "Server Error"});
        }
    }

    public async getAllConversationsForUser(req: Request, res: Response): Promise<Response> {
        try {
            if (!res.locals.userId) {
                return res.status(401).json({error: "Bad request"});
            }
            const user: IUser|null = await userRepository.getUserById(res.locals.userId.toString());
            const conversations = await conversationRepository.getAllConversationsForUser(user);
            return res.status(200).json({conversations});
        } catch (err) {
            return res.status(500).json({error: "Server Error"});
        }
    }

    public async getConversationById(req: Request, res: Response): Promise<Response> {
        try {
            const conversation = await conversationRepository.getConversationById(
                req.params.id
            );
            if (!conversation) {
                return res.status(404).json({message: "User not found"});
            }
            return res.status(200).json(conversation);
        } catch (err) {
            return res.status(500).json({error: "Server Error"});
        }
    }

    public async createConversation(req: Request, res: Response): Promise<Response> {
        try {
            let concernedUsersIds: string[] = req.body.concernedUsersIds;
            if (!concernedUsersIds) {
                return res.status(400).json({error: "Bad request"});
            }
            if(!res.locals.userId) {
                return res.status(401).json({error: "Bad request"});
            }
            concernedUsersIds.push(res.locals.userId.toString());
            const newConversation = await conversationRepository.createConversation(
                concernedUsersIds
            );
            return res.status(200).json({conversation: newConversation});
        } catch (err) {
            return res.status(500).json({error: "Server Error"});
        }
    }

    public async addMessageToConversation(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.body.content) {
                return res.status(401).json({error: "Bad Request"});
            }
            const conversationId = req.params.id;
            const result = await conversationRepository.addMessageToConversation(
                conversationId,
                req.body.content,
                req.body.messageReplyId ?? null
            );
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({error: "Server Error"});
        }
    }

    public async setConversationSeenForUserAndMessage(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.body.messageId) {
                return res.status(401).json({error: "Bad request"});
            }
            const result =
                conversationRepository.setConversationSeenForUserAndMessage(
                    req.params.id,
                    req.body.messageId
                );
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({error: "Server Error"});
        }
    }

    public async deleteConversation(req: Request, res: Response): Promise<Response> {
        try {
            const deletedConversation =
                await conversationRepository.deleteConversationById(req.params.id);
            if (!deletedConversation) {
                return res.status(404).json({error: "Conversation not found"});
            }
            return res.status(200).json({conversation: deletedConversation});
        } catch (err) {
            return res.status(500).json({error: "Server Error"});
        }
    }
}

let conversationController: ConversationController = new ConversationController();
export default conversationController;
export type {ConversationController};
