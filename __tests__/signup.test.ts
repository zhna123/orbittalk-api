
// must import from @jest/globals for typescript
import {describe, expect, it, jest, beforeEach, afterEach, beforeAll, afterAll} from '@jest/globals';
import {router as indexRouter} from '../routes/index'
import request, { SuperAgentTest } from 'supertest'
import { Server } from 'http';
import express from 'express'

import * as dbOps from '../db/dbOps';
jest.spyOn(dbOps, 'saveUser').mockImplementation(async (user) => {
  console.log("mock saveUser function - user saved successfully")
  return Promise.resolve()
})

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);

describe('user sign up', () => {

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

  it("returns code 201 and success message", async () => {
    const res = await agent
      .post('/sign-up')
      .send("username=apr")
      .send("password=123456")
      .send("passwordConfirmation=123456")
      .send("email=apr@gmail.com")

    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.statusCode).toEqual(201);
    expect(res.body.msg).toBe('user created');
  });
  
  it("returns validation error when passwordConfirmation not matching", async () => {
    const res = await agent
      .post('/sign-up')
      .send("username=apr")
      .send("password=123456")
      .send("passwordConfirmation=12345")
      .send("email=apr@gmail.com")

    expect(res.statusCode).toEqual(400);
    expect(res.body[0].msg).toBe('password does not match');
  });
});