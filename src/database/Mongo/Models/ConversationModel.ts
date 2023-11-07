import mongoose, { Document, Schema } from "mongoose";
import { MongooseID } from "../../../types";

export interface IConversation extends Document {
  participants: MongooseID[];
  messages: MongooseID[];
  title: String;
  lastUpdate: Date;
  seen: Map<MongooseID, MongooseID>;
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: [{ type: Schema.ObjectId, ref: "UserModel" }],
  messages: [{ type: Schema.ObjectId, ref: "MessageModel" }],
  title: { type: String, required: true },
  lastUpdate: { type: Date, required: true },
  seen: {
    type: Map,
    of: String,
  },
});

const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
