import ConversationModel, {
    IConversation,
} from "../database/Mongo/Models/ConversationModel";
import MessageModel, { IMessage } from "../database/Mongo/Models/MessageModel";
import { MongooseID } from "../types";
import {IUser} from "../database/Mongo/Models/UserModel";
import mongoose from "mongoose";
import userRepository from "./userRepository";
class ConversationRepository {
    public getConversationById(conversationId: MongooseID): Promise<IConversation | null> {
        return ConversationModel.findById(conversationId).exec();
    }

    public getAllConversationsForUser(user: IUser | null) {
        if (!user) {
            return [];
        }
        return ConversationModel.find({ participants: user.id }).exec();
    }

    public deleteConversationById(conversationId: MongooseID) {
        return ConversationModel.findOneAndDelete({ _id: conversationId });
    }

    public async createConversation(concernedUserIds: string[]) {
        let users: IUser[] | null = await userRepository.getUsersbyIds(concernedUserIds);
        const groupeName = users?.map((user) => user.username).join(", ");
        const conversation: IConversation = new ConversationModel({
            participants: concernedUserIds,
            title: groupeName,
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