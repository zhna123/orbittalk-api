import { ConversationModel, Conversation } from "../models/conversation";
import { User, UserModel } from "../models/user";

export async function saveUser(user: User) {
  const user_ = new UserModel(user)
  user_.save()
}

export async function findUserById(userid: string) {
  return await UserModel.findById(userid).exec();
}

export async function findUserByIdAndUpdate(userid: string, user: User) {
  return await UserModel.findByIdAndUpdate(userid, user, {})
}

export async function findUserConversations(userid: string) {
  return await ConversationModel.find({userids: userid}).exec()
}

export async function findOneConversation(convid: string, userid: string) {
  return await ConversationModel.findOne({_id: convid, userids: userid}).exec()
}

export async function saveConversation(conv: any) {
  // const conv_ = new ConversationModel(conv);
  conv.save()
}