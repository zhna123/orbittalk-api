import { Schema, model, Types, Model } from "mongoose";

// Document interface
interface User {
  _id: Types.ObjectId
  username: string;
  password: string;
  email: string;
  screen_name: string;
  avatar: Buffer;
  is_online: boolean;
  friends: Types.DocumentArray<Types.ObjectId>
}

const UserSchema = new Schema<User, Model<User>>({
  username: { type: String, required: true }, // this is unique
  password: { type: String, required: true},
  email: { type: String, required: true},
  screen_name: { type: String, default: function() {
    return this.username;
  }},
  avatar: { type: Buffer, default: null},
  is_online: { type: Boolean, default: false},
  // friends: [ this ]  // This doesn't work with typescript
})

UserSchema.add({friends: [{
  type: Schema.Types.ObjectId,
  ref: 'UserModel'
}]}) // default is []

const UserModel = model<User, Model<User>>("User", UserSchema);
export { User, UserModel, UserSchema }