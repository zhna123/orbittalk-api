import { Schema, Types, Model, model } from "mongoose";

// Subdocument definition
interface Message {
  _id: Types.ObjectId;
  content: string;
  sender: Types.ObjectId;
  image_path?: string;
  original_name?: string;
  date_time: Date,
  is_read: boolean
}

const MessageSchema = new Schema<Message>({
  content: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  image_path: { type: String }, // optional
  original_name: { type: String},
  date_time: { type: Date, default: Date.now() },
  is_read: { type: Boolean, default: false }
})

const MessageModel = model<Message, Model<Message>>('Message', MessageSchema)

export { Message, MessageSchema, MessageModel }