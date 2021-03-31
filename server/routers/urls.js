const express = require('express')
const jwtMiddleware = require('express-jwt-middleware')('superkey')
const attachUser = require('../middlewares/attachUser')
const Url = require('../models/Url')
const { ObjectID } = require('mongodb')
const router = express.Router({ mergeParams: true })
const Endpoint = require('../models/Endpoint')

function findUrl(req) {
  return Url.findOneByParams({
    _id: ObjectID(req.params.url_id),
    owner: req.user.username
  })
}

router.get('/', jwtMiddleware, attachUser, async (req, res) => {
  const urls = await Url.findManyByParams({
    endpoint_id: req.params.endpoint_id,
    owner: req.user.username
  })

  res.json({ urls })
})

router.get('/:url_id', jwtMiddleware, attachUser, async (req, res) => {
  const url = await findUrl(req)

  if (url)
    res.json({ url: url.data })
  else
    res.status(404).send()
})

router.put('/:url_id', jwtMiddleware, attachUser, async (req, res) => {
  const url = await Url.findOneByParams({
    _id: ObjectID(req.params.url_id),
    owner: req.user.username
  })

  const input = validateAndTransformURLInput(req.body)

  if (url && input) {
    await url.update(input)
    res.status(204).send()
  } else {
    res.status(400)
  }
})

router.delete('/:url_id', jwtMiddleware, attachUser, async (req, res) => {
  const url = await findUrl(req)

  if (url) {
    await url.remove()
    res.status(204).send()
  } else {
    res.status(404)
  }
})

router.post('/', jwtMiddleware, attachUser, async (req, res) => {
  const endpoint_id = req.params.endpoint_id

  const endpoint = await Endpoint.findOneByParams({
    _id: ObjectID(endpoint_id),
    owner: req.user.username
  })

  if (endpoint) {
    const input = validateAndTransformURLInput(req.body)

    if (input) {
      Url.create({
        endpoint_id,
        type: input.type,
        path: input.path,
        responses: input.responses,
        resource: input.resource,
        owner: req.user.username
      })

      res.status(204).send()
    } else {
      res.status(400).send()
    }
  } else {
    res.status(400).send()
  }
})

function validateAndTransformURLInput(input) {
  if (input.path) {
    if (input.type === 'single') {
      if (
        'GET' in input.responses &&
        'POST' in input.responses &&
        'DELETE' in input.responses &&
        'PATCH' in input.responses &&
        'PUT' in input.responses
      ) {
        input.resource = ''
      }
    } else if (input.type === 'resource') {
      try {
        JSON.parse(input.resource)
        input.responses = ''
      } catch {
        return false
      }
    } else {
      return false
    }

    return {
      path: input.path,
      type: input.type,
      responses: input.responses,
      resource: input.resource
    }
  }
}

module.exports = router