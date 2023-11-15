import mongoose, { Document, Schema } from "mongoose";
import { MongooseID } from "../../../types";
import {IMessage} from "./MessageModel";
import {IUser} from "./UserModel";

export interface IConversation extends Document {
  participants: IUser[];
  messages: IMessage[];
  title: String;
  lastUpdate: Date;
  seen: Map<MongooseID, MongooseID>;
}

const ConversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: "user" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "message" }],
  title: { type: String, required: true },
  lastUpdate: { type: Date, required: true },
  seen: {
    type: Map,
    of: String,
  },
});

const ConversationModel = mongoose.model<IConversation>("conversation", ConversationSchema);

export default ConversationModel;