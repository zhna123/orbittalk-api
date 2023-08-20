import { ConversationModel, Conversation } from "../models/conversation";
import { User, UserModel } from "../models/user";

export async function saveUser(user: User) {
  const user_ = new UserModel(user)
  await user_.save()
}

export async function findUserById(userid: string) {
  return await UserModel.findById(userid).exec();
}

export async function findUserByName(username: string) {
  return await UserModel.findOne({username: username}).exec();
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

export async function saveConversation(conv: Conversation) {
  const conv_ = new ConversationModel(conv)
  await conv_.save()
}

export async function updateConversation(convId: string, updatedFields: any) {
  try {
    await ConversationModel.findByIdAndUpdate(convId, updatedFields);
  } catch (err) {
    console.log(err)
  }
}