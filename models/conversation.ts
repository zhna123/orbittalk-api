import { Schema, model, Types, Model } from "mongoose";
import { Message, MessageSchema } from "./message";
import { User, UserSchema } from "./user";

// Document definition
interface Conversation {
  _id: Types.ObjectId
  messages: [];
  userids: [];
}
// TMethodsAndOverrides
type ConversationDocumentProps = {
  users: Types.DocumentArray<Types.ObjectId>;
  messages: Types.DocumentArray<Message>;
}

type ConversationModelType = Model<Conversation, {}, ConversationDocumentProps>

const ConversationSchema = new Schema<Conversation, ConversationModelType>({
  userids: [ {
    type: Schema.Types.ObjectId,
    ref: 'UserModel'
  } ],
  messages: [ MessageSchema ]
})

const ConversationModel = model<Conversation, ConversationModelType>("Conversation", ConversationSchema);
export { ConversationModel }