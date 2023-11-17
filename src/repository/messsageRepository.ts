import MessageModel, {IMessage} from "../database/Mongo/Models/MessageModel";
import {ReactionHelper} from "../helper/reactionHelper";

class MesssageRepository {
    public createMessage(conversationId: string, userId: string, content: string, messageReplyId: string | null): Promise<IMessage> {
        const message: IMessage = new MessageModel({
            conversationId: conversationId,
            from: userId,
            content: content,
            postedAt: new Date(),
            replyTo: messageReplyId,
            edited: false,
            deleted: false,
            reactions: new Map<string, string>()
        });
        return message.save();
    }

    public getMessageById(messageId: string): Promise<IMessage | null> {
        return MessageModel.findById(messageId)
    }

    public async deleteMessageById(messageId: string): Promise<IMessage | null> {
        let message: IMessage | null = await this.getMessageById(messageId);
        if (message) {
            message.deleted = true;
            return message.save();
        }
        return null;
    }

    public async editMessageById(messageId: string, content: string): Promise<IMessage | null> {
        let message: IMessage | null = await this.getMessageById(messageId);
        if (message) {
            message.content = content;
            message.edited = true;
            return message.save();
        }
        return null;
    }

    public async reactToMEssage(messageId: string, reaction: string, userId: string): Promise<IMessage | null> {
        let message: IMessage | null = await this.getMessageById(messageId);
        if (message) {
            const reactionEnum = ReactionHelper.setReaction(reaction);
            if (reactionEnum === null) {
                return null;
            }
            message.reactions?.set(userId, reactionEnum);
            return message.save();
        }
        return null;
    }
}

export default MesssageRepository;