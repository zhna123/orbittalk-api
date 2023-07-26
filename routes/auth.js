import express from 'express'

const router = express.Router()

// POST user log in
router.post('/login', function(req, res, next) {
  res.sendStatus(501)
})

// DELETE user log out
router.delete('logout', function(req, res, next) {
  res.sendStatus(501)
})
