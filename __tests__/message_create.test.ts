
// must import from @jest/globals for typescript
import {describe, expect, it, jest, beforeEach, afterEach} from '@jest/globals';
import request, { SuperAgentTest } from 'supertest'
import { Server } from 'http';
import express from 'express'

const authenticatedUserId = '64c288616906366dc56a78be'

// mock token authentication in router
import * as auth from '../lib/authenticate';
jest.spyOn(auth, 'authenticateToken').mockImplementation((req, res, next) => {
  // need to set authenticated user
  req.authenticatedUser = { userid: authenticatedUserId, username: 'apr' };
  return next()
})
import {router as conversationsRouter} from '../routes/conversations'

// mock DB operations
import * as dbOps from '../db/dbOps';
import { ConversationModel } from '../models/conversation';
jest.spyOn(dbOps, 'findOneConversation').mockImplementation(async (convid, userid) => {
  console.log("mock findOneConversation function")
  const conversation = new ConversationModel({
    _id: convid,
    userids: [
      userid,
      "64c288616906366dc56a9999"
    ],
    messages: [
      {
        content: "first message",
        sender: userid
      }
    ]
  })
  return Promise.resolve(conversation)
})
jest.spyOn(dbOps, 'saveConversation').mockImplementation(async (conversation) => {
  console.log("mock saveConversation function - conversation saved successfully")
  return Promise.resolve()
})

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/conversations", conversationsRouter);

describe('create new message in a conversation', () => {

  let server: Server
  let agent: SuperAgentTest

  beforeEach((done) => {
    server = app.listen(4000, () => {
      agent = request.agent(server)
      done()
    })
  })

  afterEach((done) => {
    jest.clearAllMocks()
    server.close(done)
  })

  it("returns code 201 with the updated conversation", async () => {
    const res = await agent
      .put('/conversations/64c288616906366dc5677889/messages')
      .send("content=new message")
      .send(`sender=${authenticatedUserId}`)
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.msg).toEqual("message created")
    expect(res.body.data.userids.includes(authenticatedUserId)).toBeTruthy()
    expect(res.body.data.userids.includes("64c288616906366dc56a9999")).toBeTruthy()
  });
});