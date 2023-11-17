import {ApiResponse} from "../response/apiResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import {ErrorResponse} from "../response/errorResponse";
import MesssageRepository from "../repository/messsageRepository";
import {IMessage} from "../database/Mongo/Models/MessageModel";
import {Error404} from "../Error/error";
import {IConversation} from "../database/Mongo/Models/ConversationModel";



class MessageController {
    public messageRepository = new MesssageRepository();
    public async createMessage(conversationId: string, userId: string, content: string, messageReplyId: string | null) :Promise<ApiResponse> {
        try {
            const newConversation :IMessage|null = await this.messageRepository.createMessage(conversationId, userId, content, messageReplyId);
            return new ApiResponse(undefined, newConversation);
        } catch (e) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async getMessageById(messageId: string):Promise<ApiResponse> {
        try {
            const newConversation :IMessage|null = await this.messageRepository.getMessageById(messageId);
            return new ApiResponse(undefined, newConversation);
        } catch (e) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async deleteMessage(id: string): Promise<IMessage> {
            const deletedMessage : IMessage| null = await this.messageRepository.deleteMessageById(id);
            if (!deletedMessage) {
                throw new Error404(ErrorEnum.MESSAGE_NOT_FOUND);
            }
           return deletedMessage;
    }

    public async editMessage(id: string, content: string): Promise<IMessage> {
            const editMessage : IMessage| null = await this.messageRepository.editMessageById(id, content);
            if (!editMessage) {
                throw new Error404(ErrorEnum.MESSAGE_NOT_FOUND);
            }
           return editMessage;
    }

    public async reactToMessage(id: string, reaction: string,userId: string): Promise<IMessage> {
            const editMessage : IMessage| null = await this.messageRepository.reactToMEssage(id, reaction, userId);
            if (!editMessage) {
               throw new Error404(ErrorEnum.MESSAGE_NOT_FOUND);
            }
            return editMessage;
    }

}

let messageController: MessageController = new MessageController();
export default messageController;
export type {MessageController};