import {ApiResponse} from "../response/apiResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import {ErrorResponse} from "../response/errorResponse";
import MesssageRepository from "../repository/messsageRepository";
import {IMessage} from "../database/Mongo/Models/MessageModel";



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

    public async deleteMessage(id: string): Promise<ApiResponse> {
        try {
            const deletedMessage : IMessage| null = await this.messageRepository.deleteMessageById(id);
            if (!deletedMessage) {
                return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.MESSAGE_ID_NOT_FOUND));
            }
            return new ApiResponse(undefined, deletedMessage);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async editMessage(id: string, content: string): Promise<ApiResponse> {
        try {
            const editMessage : IMessage| null = await this.messageRepository.editMessageById(id, content);
            if (!editMessage) {
                return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.MESSAGE_ID_NOT_FOUND));
            }
            return new ApiResponse(undefined, editMessage);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async reactToMessage(id: string, reaction: string,userId: string): Promise<ApiResponse> {
        try {
            const editMessage : IMessage| null = await this.messageRepository.reactToMEssage(id, reaction, userId);
            if (!editMessage) {
                return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.MESSAGE_ID_NOT_FOUND));
            }
            return new ApiResponse(undefined, editMessage);
        } catch (err) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }
}

let messageController: MessageController = new MessageController();
export default messageController;
export type {MessageController};