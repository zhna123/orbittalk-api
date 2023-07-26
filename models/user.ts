import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true},
  email: { type: String, required: true},
  avatar_path: { type: String, default: './' }, // set a default
  original_name: { type: String },
  is_online: { type: Boolean, required: true},
  friends: [ this ]  // default is []
})

const User = mongoose.model("User", UserSchema);
export { User, UserSchema }