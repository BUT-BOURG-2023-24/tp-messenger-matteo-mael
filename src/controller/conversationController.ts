import {IUser} from "../database/Mongo/Models/UserModel";
import userRepository from "../repository/userRepository";
import {ApiResponse} from "../response/apiResponse";
import {ErrorResponse} from "../response/errorResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import {IConversation} from "../database/Mongo/Models/ConversationModel";
import ConversationRepository from "../repository/conversationRepository";
import {IMessage} from "../database/Mongo/Models/MessageModel";
import {Error404, Error500} from "../Error/error";

class ConversationController {

    public conversationRepository = new ConversationRepository();

    public async getAllConversationsForUser(userId: string): Promise<IConversation[]> {
        return await this.conversationRepository.getAllConversationsForUser(userId);
    }

    public async getConversationById(conversationId: string): Promise<IConversation> {
            const conversation = await this.conversationRepository.getConversationById(
                conversationId
            );
            if (!conversation) {
               throw new Error404(ErrorEnum.CONVERSATION_NOT_FOUND);
            }
            return conversation;
    }

    public async createConversation(concernedUsersIds: string[]): Promise<IConversation> {
            const newConversation: IConversation | null = await this.conversationRepository.createConversation(concernedUsersIds);
            if (!newConversation) {
                throw new Error500(ErrorEnum.INTERNAL_SERVER_ERROR);
            }
           return newConversation;
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