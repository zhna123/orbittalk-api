
// must import from @jest/globals for typescript
import {describe, expect, it, beforeEach, afterEach, beforeAll, afterAll} from '@jest/globals';
import {router as authRouter} from '../routes/auth'
import request, { SuperAgentTest } from 'supertest'
import { Server } from 'http';
import express from 'express'

const app = express()

app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);

describe('user log in', () => {

  let server: Server
  let agent: SuperAgentTest

  beforeEach((done) => {
    server = app.listen(4000, () => {
      agent = request.agent(server)
      done()
    })
  })

  afterEach((done) => {
    server.close(done)
  })

  it("returns code 400 with validation error when missing password", async () => {
    const res = await agent
      .post('/auth/login')
      .send("username=apr")

    expect(res.statusCode).toEqual(400);
    expect(res.body[0].msg).toBe('password is required');
  });
});