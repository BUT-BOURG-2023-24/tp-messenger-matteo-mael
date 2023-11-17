import ConversationModel, {
    IConversation,
} from "../database/Mongo/Models/ConversationModel";
import {IMessage} from "../database/Mongo/Models/MessageModel";
import {IUser} from "../database/Mongo/Models/UserModel";
import userRepository from "./userRepository";
import MesssageRepository from "./messsageRepository";
import {ErrorEnum} from "../response/errorEnum";
import {Error404} from "../Error/error";



class ConversationRepository {

    public messsageRepository = new MesssageRepository();
    public getConversationById(conversationId: string): Promise<IConversation | null> {
        return ConversationModel.findById(conversationId)
            .populate({path: 'participants'})
            .populate({path: 'messages'});
    }

    public getAllConversationsForUser(userId: string) : Promise<IConversation[]> {
        return ConversationModel.find({participants: userId})
            .populate({path: 'participants'})
            .populate({path: 'messages'});
    }

    public deleteConversationById(conversationId: string): Promise<IConversation | null> {
        return ConversationModel.findOneAndDelete({_id: conversationId});
    }

    public async createConversation(concernedUserIds: string[]): Promise<IConversation | null> {
        let users: IUser[] | null = await userRepository.getUsersbyIds(concernedUserIds);
        const groupeName : string| undefined = users?.map((user) => user.username).join(", ");
        const conversation: IConversation = new ConversationModel({
            participants: concernedUserIds,
            title: groupeName,
            lastUpdate: new Date(),
            seen: new Map<string, string>()
        });
        const newConversation : IConversation| null = await ConversationModel.create(conversation)
        return this.getConversationById(newConversation.id);
    }

    public async addMessageToConversation(conversationId: string, content: string, userId: string, messageReplyId: string | null): Promise<IMessage> {
        const createdMessage: IMessage = await this.messsageRepository.createMessage(conversationId, userId, content, messageReplyId)
        const conversation: IConversation | null = await this.getConversationById(conversationId);
        if (!conversation || !createdMessage) {
            throw new Error404(ErrorEnum.CONVERSATION_NOT_FOUND);
        }
        conversation.messages.push(createdMessage.id);
        conversation.lastUpdate = new Date();
        await conversation.save();
        return createdMessage;
    }

    public setConversationSeenForUserAndMessage(conversationId: string, messageId: string, userId: string): Promise<IConversation | null> {
        return this.getConversationById(conversationId).then((conversation: IConversation | null) => {
            if (conversation) {
                conversation.seen.set(userId, messageId);
                conversation.save();
                return conversation;
            }
            return null;
        });
    }

    public getConversationFromMessageId(messageId: string) : Promise<IConversation|null> {
        return ConversationModel.findOne({messages: messageId})

    }

}

export default ConversationRepository;