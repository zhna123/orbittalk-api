
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

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/conversations", conversationsRouter);

describe('get user detail', () => {

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

  it("returns code 200 with conversation detail", async () => {
    const res = await agent
      .get('/conversations/64c288616906366dc5677889')
      
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.userids.includes(authenticatedUserId)).toBeTruthy()
    expect(res.body.messages[0].content).toBe('first message');
  });
});