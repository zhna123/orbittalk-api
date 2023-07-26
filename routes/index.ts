import express from 'express'
import expressAsyncHandler from "express-async-handler";

const router = express.Router()

/* GET home page. - NOT USED */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

// POST user sign up
router.post('/sign-up', expressAsyncHandler(async (req, res, next) => {
  res.sendStatus(501)
}))

export { router }
