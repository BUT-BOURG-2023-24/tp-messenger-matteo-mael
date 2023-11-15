import ConversationModel from "../database/Mongo/Models/ConversationModel";
import MessageModel, {IMessage} from "../database/Mongo/Models/MessageModel";

class MessageController {
    public createMessage(conversationId: string, userId: string, content: string, messageReplyId: string | null) {
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
        return MessageModel.create(message);
    }
}

let messageController: MessageController = new MessageController();
export default messageController;
export type {MessageController};