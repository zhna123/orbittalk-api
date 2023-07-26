import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  image_path: { type: String }, // optional
  original_name: { type: String},
  date_time: { type: Date, required: true },
})

const Message = mongoose.model("Message", MessageSchema);
export { Message, MessageSchema }