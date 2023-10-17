import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";
import ConversationModel from "./ConversationModel";
import UserModel from "./UserModel";
import Reaction from "../../../enum/Reaction";

export interface IMessage extends Document {
  conversationId: MongooseID;
  from: MongooseID;
  content: String;
  postedAt: Date;
  replyTo: String | null;
  edited: Boolean;
  deleted: Boolean;
  reactions: { userId: MongooseID; reaction: Reaction };
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
  conversationId: {
    type: Schema.ObjectId,
    ref: "ConversationModel",
    required: true,
  },
  from: { type: Schema.ObjectId, ref: "UserModel", required: true },
  content: { type: String, required: true },
  postedAt: { type: Date, required: true },
  replyTo: { type: String },
  edited: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  reactions: {
    type: {
      userId: { type: Schema.ObjectId, ref: "UserModel", required: true },
      reaction: Reaction,
    },
  },
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export { MessageModel, MessageSchema };
