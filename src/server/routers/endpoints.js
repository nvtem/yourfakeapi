const express = require('express')
const jwtMiddleware = require('express-jwt-middleware')('superkey')
const attachUser = require('../middlewares/attachUser')
const Endpoint = require('../models/Endpoint')
const router = express.Router({ mergeParams: true })
const { ObjectID } = require('mongodb')

router.get('/', jwtMiddleware, attachUser, async (req, res) => {
  const endpoints = await Endpoint.findManyByParams({ owner: req.user.username })
  res.json({ endpoints })
})

router.get('/:endpoint_id', jwtMiddleware, attachUser, async (req, res) => {
  const endpoint = await Endpoint.findOneByParams({
    _id: ObjectID(req.params.endpoint_id),
    owner: req.user.username
  })

  if (endpoint)
    res.json(endpoint.data)
  else
    res.status(404).send()
})

router.post('/', jwtMiddleware, attachUser, async (req, res) => {
  const name = req.body.name
  let endpoint = await Endpoint.findOneByParams({
    name,
    owner: req.user.username
  })

  if (endpoint) {
    res.status(409).send()
  } else {
    if (name) {
      Endpoint.create({
        owner: req.user.username,
        name
      })
      res.status(201).send()
    } else {
      res.status(400).send()
    }
  }
})

router.delete('/:endpoint_id', jwtMiddleware, attachUser, async (req, res) => {
  const endpoint = await Endpoint.findOneByParams({
    _id: ObjectID(req.params.endpoint_id),
    owner: req.user.username
  })

  if (endpoint) {
    await endpoint.remove()
    res.status(204).send()
  } else {
    res.status(404).send()
  }
})

router.put('/:endpoint_id', jwtMiddleware, attachUser, async (req, res) => {
  const name = req.body.name
  const endpoint = await Endpoint.findOneByParams({
    _id: ObjectID(req.params.endpoint_id),
    owner: req.user.username
  })

  if (endpoint) {
    if (name) {
      await endpoint.update({ name })
      res.status(204).send()
    } else {
      res.status(400).send()
    }
  } else {
    res.status(404).send()
  }
})

module.exports = router