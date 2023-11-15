import mongoose, { Document, Schema } from "mongoose";
import Reaction from "../../../enum/Reaction";
import { MongooseID } from "../../../types";

export interface IMessage extends Document {
  conversationId: MongooseID;
  from: MongooseID;
  content: String;
  postedAt: Date;
  replyTo: MongooseID | null;
  edited: Boolean;
  deleted: Boolean;
  reactions: Map<MongooseID, Reaction> | null;
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
  replyTo: { type: Schema.ObjectId, ref: "MessageModel" },
  edited: { type: Boolean, required: true },
  deleted: { type: Boolean, required: true },
  reactions: { type: Map, of: String },
});

const MessageModel = mongoose.model<IMessage>("message", MessageSchema);

export default MessageModel;