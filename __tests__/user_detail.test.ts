
// must import from @jest/globals for typescript
import {describe, expect, it, jest, beforeEach, afterEach} from '@jest/globals';
import request, { SuperAgentTest } from 'supertest'
import { Server } from 'http';
import express from 'express'

// mock token authentication in router
import * as auth from '../lib/authenticate';
jest.spyOn(auth, 'authenticateToken').mockImplementation((req, res, next) => {
  // need to set authenticated user
  req.authenticatedUser = { userid: '64c288616906366dc56a78be', username: 'apr' };
  return next()
})
import {router as usersRouter} from '../routes/users'

// mock DB operations
import * as dbOps from '../db/dbOps';
import { UserModel } from '../models/user';
jest.spyOn(dbOps, 'findUserById').mockImplementation(async (userid) => {
  console.log("mock findUserById function")
  const user = new UserModel({
    _id: userid,
    username: "apr",
    password: "123456",
    email: "apr@gmail.com"
  })
  return Promise.resolve(user)
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

  it("returns code 200 with user detail", async () => {
    const res = await agent
      .get('/users')
      
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('apr');
  });
});