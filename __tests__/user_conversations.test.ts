
// must import from @jest/globals for typescript
import {describe, expect, it, jest, beforeEach, afterEach} from '@jest/globals';
import request, { SuperAgentTest } from 'supertest'
import { Server } from 'http';
import express from 'express'

const authenticatedUserId = '64c288616906366dc56a78be';

// mock token authentication in router
import * as auth from '../lib/authenticate';
jest.spyOn(auth, 'authenticateToken').mockImplementation((req, res, next) => {
  // need to set authenticated user
  req.authenticatedUser = { userid: authenticatedUserId, username: 'apr' };
  return next()
})
import {router as usersRouter} from '../routes/users'

// mock DB operations
import * as dbOps from '../db/dbOps';
import { ConversationModel } from '../models/conversation';
jest.spyOn(dbOps, 'findUserConversations').mockImplementation(async (userid) => {
  console.log("mock findUserConversations function")
  const conversation = new ConversationModel({
    _id: "64d10ac07c0bbe18f53d3e1d",
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
  return Promise.resolve([conversation])
})

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/users", usersRouter);

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

  it("returns code 200 with user's conversations", async () => {
    const res = await agent
      .get('/users/conversations')
      
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1)
    expect(res.body[0].userids.includes(authenticatedUserId)).toBeTruthy()
  });
});