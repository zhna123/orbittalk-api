import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/user';

const router = express.Router()

/* GET home page. - NOT USED */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

// POST user sign up
router.post('/sign-up', [

  body('username')
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage('username is required'),

  body('password')
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage('password is required'),

  body('passwordConfirmation')
  .custom((value, {req}) => {
    return value === req.body.password
  })
  .withMessage('password does not match'),

  body('email')
  .isEmail()  // TODO add a custom validator to check duplicates 
  .withMessage('email is not valid') ,

  expressAsyncHandler( async (req, res, next) => {
    const errors = validationResult(req)
    const user = new UserModel({
      username: req.body.username,
      email: req.body.email
    })
    if (!errors.isEmpty) {
      res.status(500).json({...errors.array()})
    } else {
      bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
        if (err) {
          return next(err)
        } else {
          user.password = hashedPassword;
          await user.save();
          res.status(201).json({msg: 'user created'})
        }
      })
    }
  })
])

export { router }
