import ConversationModel, {
  IConversation,
} from "../database/Mongo/Models/ConversationModel";
import MessageModel, { IMessage } from "../database/Mongo/Models/MessageModel";
import { MongooseID } from "../types";

class ConversationRepository {
  public getConversationById(
    conversationId: MongooseID
  ): Promise<IConversation | null> {
    return ConversationModel.findById(conversationId).exec();
  }

  public getAllConversationsForUser() {
    return ConversationModel.find().where("participants").in([]); // TODO : put the current user
  }

  public deleteConversationById(conversationId: MongooseID) {
    return ConversationModel.deleteOne({ _id: conversationId });
  }

  public createConversation(concernedUserIds: MongooseID[]) {
    const defaultTitle = "New group"; // TODO : Default is group users names
    const conversation: IConversation = new ConversationModel({
      participants: concernedUserIds,
      title: defaultTitle,
      lastUpdate: new Date(),
    });
    return ConversationModel.create(conversation);
  }

  public addMessageToConversation(
    conversationId: MongooseID,
    content: string,
    messageReplyId: MongooseID | null
  ) {
    const message: IMessage = new MessageModel({
      conversationId: conversationId,
      from: null, // TODO: put curent user
      content: content,
      postedAt: new Date(),
      replyTo: messageReplyId,
      edited: false,
      deleted: false,
    });
    return MessageModel.create(message).then((createdMessage) => {
      return this.getConversationById(conversationId).then((conversation) => {
        if (conversation) {
          conversation.messages.push(createdMessage.id);
          conversation.save();
        }
      });
    });
  }

  public setConversationSeenForUserAndMessage(
    conversationId: MongooseID,
    messageId: MongooseID
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
