const express = require('express')
const router = express.Router({ mergeParams: true })
const Url = require('../models/Url')
const _ = require('lodash')

async function tryToUseResource(endpoint_id, path, req, res) {
  let segments = path.split('/')
  const url = await Url.findOneByParams({ endpoint_id, 'type': 'resource', path: segments[0] })

  if (!url) {
    res.status(400).send()
    return false
  }

  const resource = JSON.parse(url.data.resource)

  let pathToObj
  let obj

  if (segments.length === 1) {
    obj = resource
  } else {
    pathToObj = segments.slice(1).join('.')
    obj = _.get(resource, pathToObj)
  }

  switch (req.method) {
    case 'GET':
      if (obj)
        res.status(200).json(obj)
      else
        res.status(404).send()
      break

    case 'POST':
      if (obj) {
        const id = obj.length

        obj.push({
          id,
          ...req.body
        })

        url.update({resource: JSON.stringify(resource)})
        res.status(201).json({id})
      } else {
        res.status(400).send()
      }
      break

    case 'DELETE':
      segments = pathToObj.split('.')
      pathToObj = segments.slice(0, -1).join('.')
      obj = _.get(resource, pathToObj)

      if (obj && Array.isArray(obj)) {
        obj.splice(segments[segments.length], 1)

        url.update({resource: JSON.stringify(resource)})
        res.status(204).send()
      } else {
        res.status(404).send()
      }
      break

    case 'PUT':
    case 'PATCH':
      if (obj) {
        _.assign(obj, req.body)
        url.update({resource: JSON.stringify(resource)})
        res.status(204).send()
      } else {
        res.status(404).send()
      }
      break
  }

  return true
}

router.all('/*', async (req, res) => {
  const match = req.originalUrl.match(/^\/endpoint\/[0-9a-f]{24}\/(.+)/)

  if (match) {
    const path = match[1]
    const endpoint_id = req.params.endpoint_id

    const url = await Url.findOneByParams({
      type: 'single',
      endpoint_id,
      path
    })

    if (url)
      res.send(url.data.responses[req.method])
    else {
      if (!await tryToUseResource(endpoint_id, path, req, res))
        res.status(400).send()
    }
  } else {
    res.status(400).send()
  }
})

module.exports = router