import {Request, Response} from "express";
import ConversationRepository from "../repository/conversationRepository";
import {IUser} from "../database/Mongo/Models/UserModel";
import userRepository from "../repository/userRepository";
import {ApiResponse} from "../response/apiResponse";
import {ErrorResponse} from "../response/errorResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import userController from "./userController";

const conversationRepository = new ConversationRepository();

class ConversationController {

    public async getConversationWithParticipants(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json();
        } catch (error) {
            return res.status(500).json({message: "Server Error"});
        }
    }

    public async getAllConversationsForUser(userId: string): Promise<ApiResponse> {
        try {
            if (!userId) {
                return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.AUTHENTICATION_NEEDED));
            }
            const user: IUser | null = await userRepository.getUserById(userId);
            const conversations = await conversationRepository.getAllConversationsForUser(user?.id);
            return new ApiResponse(undefined, {conversations});
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }
    public async getConversationById(conversationId: string): Promise<ApiResponse> {
        try {
            const conversation = await conversationRepository.getConversationById(
                conversationId
            );
            if (!conversation) {
                return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.CONVERSATION_NOT_FOUND));
            }
            return new ApiResponse(undefined, conversation);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async createConversation(concernedUsersIds: string[], userId?: string): Promise<ApiResponse> {
        try {
            if (!concernedUsersIds) {
                return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.USERS_NOT_FOUND));
            }
            if (!userId) {
                return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.AUTHENTICATION_NEEDED));
            }
            concernedUsersIds.push(userId);
            const newConversation = await conversationRepository.createConversation(
                concernedUsersIds
            );
            return new ApiResponse(undefined, newConversation);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async addMessageToConversation(messageContent: string, conversationId: string, userId: string, messageReplyId?: string): Promise<ApiResponse> {
        try {
            if (!messageContent) {
                return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.MESSAGE_CONTENT_NOT_FOUND));
            }
            const result = await conversationRepository.addMessageToConversation(
                conversationId,
                messageContent,
                userId,

                messageReplyId ?? null,
            );
            return new ApiResponse(undefined, result);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async setConversationSeenForUserAndMessage(messageId: string,conversationid: string,userId: string): Promise<ApiResponse> {
        try {
            if (!messageId) {
                return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.MESSAGE_ID_NOT_FOUND))
            }
           const modifyConversation = await conversationRepository.setConversationSeenForUserAndMessage(conversationid, messageId,userId)
            if (!modifyConversation) {
                return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.CONVERSATION_NOT_FOUND));
            }
            return new ApiResponse(undefined, {modifyConversation});
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async deleteConversation(id: string): Promise<ApiResponse> {
        try {
            const deletedConversation =
                await conversationRepository.deleteConversationById(id);
            if (!deletedConversation) {
                return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.CONVERSATION_NOT_FOUND));
            }
            return new ApiResponse(undefined, deletedConversation);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }
}

let conversationController: ConversationController = new ConversationController();
export default conversationController;
export type {ConversationController};