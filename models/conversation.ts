import mongoose from "mongoose";
import { MessageSchema } from "./message";
import { UserSchema } from "./user";

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  messages: [ MessageSchema ],
  users: [ UserSchema ]
})

const Conversation = mongoose.model("Conversation", ConversationSchema);
export { Conversation }