import { Schema, model, Types, Model } from "mongoose";
import { Message, MessageSchema } from "./message";
import { User, UserSchema } from "./user";

// Document definition
interface Conversation {
  messages: [];
  users: [];
}
// TMethodsAndOverrides
type ConversationDocumentProps = {
  users: Types.DocumentArray<User>;
  messages: Types.DocumentArray<Message>;
}

type ConversationModelType = Model<Conversation, {}, ConversationDocumentProps>

const ConversationSchema = new Schema<Conversation, ConversationModelType>({
  users: [ UserSchema ],
  messages: [ MessageSchema ]
})

const ConversationModel = model<Conversation, ConversationModelType>("Conversation", ConversationSchema);
export { ConversationModel }