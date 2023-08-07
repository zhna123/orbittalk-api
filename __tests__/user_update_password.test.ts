// must import from @jest/globals for typescript
import {describe, expect, it, jest, beforeEach, afterEach} from '@jest/globals';
import request, { SuperAgentTest } from 'supertest'
import { Server } from 'http';
import express from 'express'
import bcrypt from 'bcryptjs'

// mock token authentication in router
import * as auth from '../lib/authenticate';
jest.spyOn(auth, 'authenticateToken').mockImplementation((req, res, next) => {
  console.log("mocked authentication")
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
  const pwd = "123456"
  const hashedPwd = await bcrypt.hash(pwd, 10);
  const user = new UserModel({
    _id: userid,
    username: "apr",
    password: hashedPwd,
    email: "apr@gmail.com"
  })
  return Promise.resolve(user)
})
jest.spyOn(dbOps, 'findUserByIdAndUpdate').mockImplementation(async (userid, user) => {
  console.log("mock findUserByIdAndUpdate function")
  // mocked updated user
  const theUser = new UserModel({
    _id: userid,
    username: "apr",
    password: user.password,
    email: "apr@gmail.com"
  })
  return Promise.resolve(theUser)
})

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/users", usersRouter);

describe("update user password", () => {
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

  it("throw validation error if old password doesn't match password in DB", async () => {

    const res = await agent
      .put('/users/password')
      .send("oldPassword=abc")
      .send("password=1234567")
      .send("passwordConfirmation=1234567")
      
    expect(res.statusCode).toEqual(400);
    expect(res.body[0].msg).toBe("old password is wrong")
  })

  it("throw validation error if new password is the same as old password", async () => {

    const res = await agent
      .put('/users/password')
      .send("oldPassword=123456")
      .send("password=123456")
      .send("passwordConfirmation=123456")
      
    expect(res.statusCode).toEqual(400);
    expect(res.body[0].msg).toBe("password is the same as the previous one")
  })

  it("throw validation error if password confirmation doesn't match", async () => {

    const res = await agent
      .put('/users/password')
      .send("oldPassword=123456")
      .send("password=1234567")
      .send("passwordConfirmation=abcde")
      
    expect(res.statusCode).toEqual(400);
    expect(res.body[0].msg).toBe("password does not match")
  })

  it("update successful with status code 200", async () => {

    const res = await agent
      .put('/users/password')
      .send("oldPassword=123456")
      .send("password=1234567")
      .send("passwordConfirmation=1234567")
      
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(200);

    const result = await bcrypt.compare("1234567", res.body.password)
    expect(result).toBeTruthy();
  })

})