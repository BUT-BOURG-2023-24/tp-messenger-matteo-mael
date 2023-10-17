import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";
import UserModel from "./UserModel";
import { MessageModel } from "./MessageModel";

export interface IConversation extends Document {
  participants: MongooseID[];
  messages: MongooseID[];
  title: String;
  lastUpdate: Date;
  seen: { userId: MongooseID; messageId: MongooseID };
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: [{ type: Schema.ObjectId, ref: "UserModel" }],
  messages: [{ type: Schema.ObjectId, ref: "MessageModel" }],
  title: { type: String, required: true },
  lastUpdate: { type: Date, required: true },
  seen: {
    type: {
      userId: { type: Schema.ObjectId, ref: "UserModel", required: true },
      messageId: { type: Schema.ObjectId, ref: "MessageModel", required: true },
    },
  },
});

const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
