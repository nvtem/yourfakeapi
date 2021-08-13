const { MongoClient, ObjectID } = require("mongodb")
const express = require('express')
const jwt = require('jsonwebtoken')
const jwtMiddleware = require('express-jwt-middleware')('superkey')
const { generateToken, hash, verifyHash } = require('../commonFunctions')
const attachUser = require('../middlewares/attachUser')

const User = require('../models/User')

const router = express.Router({ mergeParams: true })

router.post('/register', async (req, res) => {
  let { username, password }  = req.body
  let user = await User.findOneByParams({ username })

  if (user) {
    res.status(401).json({
      message: 'User already exists',
      input: 'username',
    })
  } else {
    if (password.length >= 8) {
      const hashedPassword = hash(password)
      await User.create({
        username,
        hashedPassword
      })

      user = await User.findOneByParams({ username })
      const token = generateToken(user.data)

      res.json({ token })
    } else {
      res.status(401).json({
        message: 'Invalid password',
        input: 'password',
      })
    }
  }
})

router.post('/login', async (req, res) => {
  let { username, password } = req.body
  const user = await User.findOneByParams({ username })

  if (user) {
    const passwordIsCorrect = verifyHash(password, user.data.hashedPassword)

    if (passwordIsCorrect) {
      const token = generateToken(user.data)
      res.json({ token })
    } else {
      res.status(401).json({
        message: 'Invalid password',
        input: 'password',
      })
    }
  } else {
    res.status(401).json({
      message: 'Invalid username',
      input: 'username',
    })
  }
})

router.get('/getUserData', jwtMiddleware, async (req, res) => {
  res.json({
    username: req.tokenData.data.username
  })
})

router.post('/changePassword', jwtMiddleware, attachUser, async (req, res) => {
  let { password, newPassword } = req.body
  const username = req.user.username
  let user = await User.findOneByParams({ username })

  if (user) {
    const passwordIsCorrect = verifyHash(password, user.data.hashedPassword)

    if (passwordIsCorrect) {
      if (newPassword.length >= 8) {
        const hashedPassword = hash(newPassword)

        user.update({ hashedPassword })
        user = await User.findOneByParams({ username })
        const token = generateToken(user.data)

        res.json({ token })
      } else {
        res.status(401).json({
          message: 'Invalid new password',
          input: 'newPassword'
        })
      }
    } else {
      res.status(401).json({
        message: 'Invalid password',
        input: 'password'
      })
    }
  } else {
    res.status(401).send()
  }
})

module.exports = router