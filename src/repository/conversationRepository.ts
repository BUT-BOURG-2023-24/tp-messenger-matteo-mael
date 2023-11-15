import ConversationModel, {
    IConversation,
} from "../database/Mongo/Models/ConversationModel";
import MessageModel, { IMessage } from "../database/Mongo/Models/MessageModel";
import {IUser} from "../database/Mongo/Models/UserModel";
import userRepository from "./userRepository";
class ConversationRepository {
    public getConversationById(conversationId: string): Promise<IConversation | null> {
        return ConversationModel.findById(conversationId)
            .populate({ path: 'participants'})
            .populate({ path: 'messages' });
    }

    public getAllConversationsForUser(userId: string) {
        return ConversationModel.find({ participants: userId })
            .populate({ path: 'participants'})
            .populate({ path: 'messages' });
    }

    public deleteConversationById(conversationId: string) {
        return ConversationModel.findOneAndDelete({ _id: conversationId });
    }

    public async createConversation(concernedUserIds: string[]) {
        let users: IUser[] | null = await userRepository.getUsersbyIds(concernedUserIds);
        const groupeName = users?.map((user) => user.username).join(", ");
        const conversation: IConversation = new ConversationModel({
            participants: concernedUserIds,
            title: groupeName,
            lastUpdate: new Date(),
            seen:  new Map<string,string>()
        });
        return ConversationModel.create(conversation);
    }

    public async addMessageToConversation(conversationId: string, content: string, userId: string, messageReplyId: string | null) {
        try {
            const message: IMessage = new MessageModel({
                conversationId: conversationId,
                from: userId,
                content: content,
                postedAt: new Date(),
                replyTo: messageReplyId,
                edited: false,
                deleted: false,
            });
            const createdMessage: IMessage = await MessageModel.create(message);
            const conversation: IConversation | null = await this.getConversationById(conversationId);
            if (!conversation) {
                console.error('Conversation not found');
                return null;
            }

            conversation.messages.push(createdMessage.id);
            conversation.lastUpdate = new Date();

            const updatedConversation = await conversation.save();

            const populatedConversation = await ConversationModel
                .findById(updatedConversation._id)
                .populate({
                    path: 'messages',
                    model: 'MessageModel',
                    populate: {
                        path: 'from',
                        model: 'UserModel',
                    },
                })
                .exec();

            return populatedConversation;
        } catch (error) {
            console.error('Error adding message to conversation:', error);
            throw error;
        }
    }
    public setConversationSeenForUserAndMessage(
        conversationId: string,
        messageId: string
    ) {
        this.getConversationById(conversationId).then((conversation) => {
            if (conversation) {
                conversation.seen.set("0", messageId); // Replace with userId
                conversation.save();
            }
        });
    }
}

export default ConversationRepository;