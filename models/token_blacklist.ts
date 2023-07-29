import { Schema, model, Types, Model } from "mongoose";

type TypeStrings = 'ACCESS' | 'REFRESH';

interface Token_Blacklist {
  _id: Types.ObjectId
  token: string,
  type: TypeStrings,
  reason: string,
  blacklisted_at: Date
}

const Token_BlacklistSchema= new Schema<Token_Blacklist, Model<Token_Blacklist>>({
  token: {type: String, required: true},
  type: {type: String, required: true},
  reason: {type: String, required: true},
  blacklisted_at: {type: Date, required: true}
})

const BlacklistModel = model<Token_Blacklist, Model<Token_Blacklist>>("Blacklist", Token_BlacklistSchema)

export { BlacklistModel }