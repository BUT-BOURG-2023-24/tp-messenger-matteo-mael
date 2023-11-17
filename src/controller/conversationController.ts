import {IUser} from "../database/Mongo/Models/UserModel";
import userRepository from "../repository/userRepository";
import {ApiResponse} from "../response/apiResponse";
import {ErrorResponse} from "../response/errorResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import {IConversation} from "../database/Mongo/Models/ConversationModel";
import ConversationRepository from "../repository/conversationRepository";
import {IMessage} from "../database/Mongo/Models/MessageModel";
import {Error404} from "../Error/error";

class ConversationController {

    public conversationRepository = new ConversationRepository();

    public async getAllConversationsForUser(userId: string): Promise<IConversation[]> {
        return await this.conversationRepository.getAllConversationsForUser(userId);
    }

    public async getConversationById(conversationId: string): Promise<ApiResponse> {
        try {
            const conversation = await this.conversationRepository.getConversationById(
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
            const newConversation: IConversation | null = await this.conversationRepository.createConversation(
                concernedUsersIds
            );
            return new ApiResponse(undefined, newConversation);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async addMessageToConversation(messageContent: string, conversationId: string, userId: string, messageReplyId?: string): Promise<IMessage> {
        const result: IMessage | null = await this.conversationRepository.addMessageToConversation(
            conversationId,
            messageContent,
            userId,
            messageReplyId ?? null,
        );
        return result
    }

    public async setConversationSeenForUserAndMessage(messageId: string, conversationid: string, userId: string): Promise<IConversation> {
        const modifyConversation: IConversation | null = await this.conversationRepository.setConversationSeenForUserAndMessage(conversationid, messageId, userId)
        if (!modifyConversation) {
            throw new Error(ErrorEnum.CONVERSATION_NOT_FOUND);
        }
        return modifyConversation;
    }

    public async deleteConversation(id: string): Promise<IConversation> {
        const deletedConversation: IConversation | null = await this.conversationRepository.deleteConversationById(id);
        if (!deletedConversation) {
            throw new Error404(ErrorEnum.CONVERSATION_NOT_FOUND);
        }
        return deletedConversation
    }

    public async getConversationFromMessageId(messageId: string): Promise<IConversation> {
        const conversation : IConversation | null = await this.conversationRepository.getConversationFromMessageId(messageId);
        if (!conversation) {
            throw new Error404(ErrorEnum.CONVERSATION_NOT_FOUND);
        }
        return conversation;
    }
}

let conversationController: ConversationController = new ConversationController();
export default conversationController;
export type {ConversationController};